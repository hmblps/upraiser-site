   433	        cursor: "pointer",
   434	        touchAction: "manipulation",
   435	        userSelect: "none",
   436	      }}
   437	    >
   438	      <span
   439	        style={{
   440	          width: 28,
   441	          height: 28,
   442	          borderRadius: "50%",
   443	          background: "rgba(12,12,12,0.55)",
   444	          border: "1px solid rgba(255,255,255,0.45)",
   445	          backdropFilter: "blur(8px)",
   446	          display: "flex",
   447	          alignItems: "center",
   448	          justifyContent: "center",
   449	          color: "#fff",
   450	          fontSize: 15,
   451	          fontWeight: 500,
   452	          lineHeight: 1,
   453	          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
   454	        }}
   455	      >
   456	        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
   457	          <path d="M1.2 1.2l9.6 9.6M10.8 1.2L1.2 10.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
   458	        </svg>
   459	      </span>
   460	    </motion.button>
   461	  );
   462	}
   463	
   464	/**
   465	 * CSS chassis for formats that need real HTML (rich iframe, video interstitial).
   466	 * Drop-shadow lives on the untransformed wrapper so perspective cannot square the shadow.
   467	 */
   468	function CssFormatPhone({ mode, formatId }: { mode: SiteMode; formatId: "rich" | "video" }) {
   469	  const isDark = mode !== "growth";
   470	  const wrapRef = useRef<HTMLDivElement>(null);
   471	  const [adScale, setAdScale] = useState(0.64);
   472	  const [closed, setClosed] = useState(false);
   473	
   474	  useEffect(() => {
   475	    setClosed(false);
   476	  }, [formatId]);
   477	
   478	  useEffect(() => {
   479	    if (!closed) return;
   480	    const t = window.setTimeout(() => setClosed(false), 1800);
   481	    return () => window.clearTimeout(t);
   482	  }, [closed]);
   483	
   484	  useEffect(() => {
   485	    if (formatId !== "rich") return;
   486	    const el = wrapRef.current;
   487	    if (!el) return;
   488	    const ro = new ResizeObserver(([entry]) => {
   489	      const { width } = entry.contentRect;
   490	      if (width > 0) setAdScale(Math.min(1, width / AD_W));
   491	    });
   492	    ro.observe(el);
   493	    return () => ro.disconnect();
   494	  }, [formatId]);
   495	
   496	  const phoneGrad = isDark
   497	    ? "linear-gradient(155deg, #f0a06a, #c96f3a 42%, #9a5228)"
   498	    : "linear-gradient(155deg, #5a7498 0%, #2a4060 34%, #152238 68%, #0c1524 100%)";
   499	
   500	  return (
   501	    <motion.div
   502	      key={`css-phone-${formatId}`}
   503	      initial={false}
   504	      animate={{ opacity: 1, scale: 1, y: 0 }}
   505	      exit={{ opacity: 0, scale: 0.94, y: -16 }}
   506	      transition={{ type: "spring", stiffness: 280, damping: 28 }}
   507	      style={{
   508	        position: "absolute",
   509	        inset: 0,
   510	        display: "flex",
   511	        alignItems: "center",
   512	        justifyContent: "center",
   513	        zIndex: 2,
   514	        pointerEvents: "all",
   515	      }}
   516	    >
   517	      {/* Shadow on this untransformed box so perspective cannot square it */}
   518	      <div
   519	        style={{
   520	          height: "clamp(340px, 56dvh, 520px)",
   521	          aspectRatio: "430 / 879",
   522	          flexShrink: 0,
   523	          borderRadius: "clamp(1.55rem, 2.6vh, 2.2rem)",
   524	          transform: "translateY(2dvh)"
   525	        }}
   526	      >
   527	      <div
   528	        style={{
   529	          width: "100%",
   530	          height: "100%",
   531	          background: phoneGrad,
   532	          borderRadius: "clamp(1.55rem, 2.6vw, 2.2rem)",
   533	          padding: "clamp(0.14rem, 0.4vw, 0.22rem)",
   534	          boxShadow: isDark
   535	            ? "inset 0 1px 0 rgba(255,220,160,0.35), inset 0 -1px 0 rgba(0,0,0,0.45)"
   536	            : "inset 0 1px 0 rgba(210,230,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.45)",
   537	          position: "relative",
   538	          overflow: "hidden",
   539	        }}
   540	      >
   541	        <div
   542	          ref={wrapRef}
   543	          style={{
   544	            position: "relative",
   545	            width: "100%",
   546	            height: "100%",
   547	            borderRadius: "clamp(1.3rem, 2.3vw, 1.95rem)",
   548	            overflow: "hidden",
   549	            background: "#000",
   550	            border: "2px solid rgba(0,0,0,0.84)",
   551	          }}
   552	        >
   553	          <div
   554	            style={{
   555	              position: "absolute",
   556	              top: "clamp(0.45rem, 1.2vw, 0.65rem)",
   557	              left: "50%",
   558	              transform: "translateX(-50%)",
   559	              width: "clamp(2.2rem, 20%, 3.1rem)",
   560	              height: "clamp(0.5rem, 1.4vw, 0.7rem)",
   561	              borderRadius: "999px",
   562	              background: "#000",
   563	              zIndex: 5,
   564	              pointerEvents: "none",
   565	          }}
   566	          />
   567	
   568	          {formatId === "rich" ? (
   569	            <div
   570	              style={{
   571	                position: "absolute",
   572	                top: 0,
   573	                left: "50%",
   574	                width: AD_W,
   575	                height: AD_H,
   576	                transformOrigin: "top center",
   577	                transform: `translateX(-50%) scale(${adScale})`,
   578	                overflow: "hidden",
   579	              }}
   580	            >
   581	              <iframe
   582	                src="/rich-media-ad.html"
   583	                style={{ width: AD_W, height: AD_H, border: "none", display: "block", cursor: "none" }}
   584	                allow="autoplay; encrypted-media"
   585	                title="Rich Media Ad"
   586	              />
   587	            </div>
   588	          ) : closed ? (
   589	            <div
   590	              style={{
   591	                position: "absolute",
   592	                inset: 0,
   593	                background: "#0a0a0a",
   594	                display: "flex",
   595	                alignItems: "center",
   596	                justifyContent: "center",
   597	                color: "rgba(255,255,255,0.45)",
   598	                fontSize: 11,
   599	                letterSpacing: "0.08em",
   600	                textTransform: "uppercase",
   601	              }}
   602	            >
   603	              Ad closed
   604	            </div>
   605	          ) : (
   606	            <>
   607	              <InterstitialVideo
   608	                style={{
   609	                  position: "absolute",
   610	                  inset: 0,
   611	                  width: "100%",
   612	                  height: "100%",
   613	                  objectFit: "cover",
   614	                  display: "block",
   615	                }}
   616	              />
   617	              <AdCloseButton onClick={() => setClosed(true)} />
   618	            </>
   619	          )}
   620	
   621	          {formatId === "rich" && (
   622	            <div
   623	              style={{
   624	                pointerEvents: "none",
   625	                position: "absolute",
   626	                inset: 0,
   627	                zIndex: 4,
   628	                background:
   629	                  "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 28%, transparent 74%, rgba(255,255,255,0.04) 100%)",
   630	                mixBlendMode: "soft-light",
   631	              }}
   632	            />
   633	          )}
   634	        </div>
   635	      </div>
   636	      </div>
   637	    </motion.div>
   638	  );
   639	}
   640	
   641	/**
   642	 * 3D iPhone chassis.
   643	 * Glass: still PNG instantly → format MP4 on the same materials (no remount flash).
   644	 * For "rich" format: CSS phone frame with live Vidout HTML ad iframe.
   645	 */
   646	export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className, flat = false }: Phone3DProps) {
   647	  const reduced = useReducedMotion();
   648	  const stageRef = useRef<HTMLDivElement>(null);
   649	  const dragging = useRef(false);
   650	  const last = useRef({ x: 0, y: 0 });
   651	
   652	  const rotY = useMotionValue(REST_Y);
