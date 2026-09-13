with open("src/components/channel-visuals/Tv3D.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "<DeviceLoadStage ready={meshReady} placeholder={null} instant>",
    """<DeviceLoadStage
        ready={meshReady}
        instant
        placeholder={
          <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
            <div className="w-[80%] aspect-video rounded-xl border border-white/20 bg-white/5 animate-pulse" />
          </div>
        }
      >"""
)

with open("src/components/channel-visuals/Tv3D.tsx", "w") as f:
    f.write(code)

with open("src/components/channel-visuals/Tablet3D.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "<DeviceLoadStage ready={meshReady} placeholder={null} instant>",
    """<DeviceLoadStage
        ready={meshReady}
        instant
        placeholder={
          <div className="w-full h-full flex items-center justify-center opacity-50">
            <div className="w-[60%] aspect-[3/4] rounded-2xl border border-white/20 bg-white/5 animate-pulse" />
          </div>
        }
      >"""
)

with open("src/components/channel-visuals/Tablet3D.tsx", "w") as f:
    f.write(code)
