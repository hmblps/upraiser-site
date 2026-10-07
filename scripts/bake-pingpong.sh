#!/usr/bin/env bash
# Bake a seamless ping-pong loop (forward → reverse → forward …) into ONE mp4.
#
# Why: runtime blending of two <video> elements (canvas drawImage) gives uneven
# frame pacing and the crossfade can't be aligned to a frame. Baking the turn
# into the file makes the browser play a single looping stream — zero JS.
#
# Alignment trick: the reverse clip is overlapped with the forward clip by W
# frames. At the midpoint of the overlap both clips show the SAME source frame,
# so the blend is ghost-free exactly where it is 50/50; the ghosting only
# exists at the edges where one layer is almost transparent (smoothstep).
# The loop seam (end → start) is baked with the same overlap pattern.
#
# RETIME=0 skips the motion-evening pass (see scripts/retime-motion.py).
# Usage: scripts/bake-pingpong.sh <source.mp4> <out.mp4> [overlap_frames=36] [crf=30]
set -euo pipefail

SRC="$1"; OUT="$2"; WF="${3:-36}"; CRF="${4:-30}"
FPS=30
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

ENC_MASTER=(-an -c:v libx264 -crf 10 -preset veryfast -pix_fmt yuv420p -r $FPS)

HERE="$(cd "$(dirname "$0")" && pwd)"
if [ "${RETIME:-1}" = "1" ]; then
  echo "▸ 1/4 forward master — retimed (removes frame-pacing judder)"
  python3 "$HERE/retime-motion.py" "$SRC" "$WORK/fwd.mp4"
else
  echo "▸ 1/4 forward master (1080p, ${FPS}fps)"
  ffmpeg -v error -stats -i "$SRC" -vf "scale=1920:1080:flags=lanczos" "${ENC_MASTER[@]}" -y "$WORK/fwd.mp4"
fi

echo "▸ 2/4 reverse master"
ffmpeg -v error -stats -i "$WORK/fwd.mp4" -vf reverse "${ENC_MASTER[@]}" -y "$WORK/rev.mp4"

N1=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$WORK/fwd.mp4")
N=$(( 2 * N1 - WF ))
OFFSET=$(python3 -c "print(($N1 - $WF) / $FPS)")
DUR=$(python3 -c "print($WF / $FPS)")
# smoothstep; P runs 1→0 in ffmpeg's xfade, so A (outgoing) gets weight s(P)
EXPR="A*(P*P*(3-2*P))+B*(1-P*P*(3-2*P))"

echo "▸ 3/4 turn crossfade (N1=$N1 frames, overlap=$WF, total=$N)"
ffmpeg -v error -stats -i "$WORK/fwd.mp4" -i "$WORK/rev.mp4" \
  -filter_complex "[0][1]xfade=transition=custom:duration=$DUR:offset=$OFFSET:expr='$EXPR'" \
  "${ENC_MASTER[@]}" -y "$WORK/s.mp4"

echo "▸ 4/4 loop seam crossfade + final encode"
# V[t] = mix(S[N-WF+t] → S[t]) for t<WF, then S[WF .. N-WF)
ffmpeg -v error -stats -i "$WORK/s.mp4" \
  -filter_complex "
    [0]split=3[a][b][c];
    [a]trim=start_frame=$((N-WF)):end_frame=$N,setpts=PTS-STARTPTS[tail];
    [b]trim=start_frame=0:end_frame=$WF,setpts=PTS-STARTPTS[head];
    [c]trim=start_frame=$WF:end_frame=$((N-WF)),setpts=PTS-STARTPTS[mid];
    [tail][head]xfade=transition=custom:duration=$DUR:offset=0:expr='$EXPR'[p1];
    [p1][mid]concat=n=2:v=1:a=0[out]" \
  -map "[out]" -an -c:v libx264 -crf "$CRF" -preset slow -profile:v high -pix_fmt yuv420p \
  -maxrate 5M -bufsize 10M -r $FPS -g 60 -keyint_min 30 -movflags +faststart -y "$OUT"

ls -lh "$OUT"
