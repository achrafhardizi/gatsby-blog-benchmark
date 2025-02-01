import React, { useState, useEffect } from 'react';

const ViewCounter = ({ url = '' }) => {
    const [viewCount, setViewCount] = useState('0');

    const encodedUrl = encodeURIComponent(url);
    const counterUrl = `https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodedUrl}&count_bg=%234E763000&title_bg=%237A464600&icon=&icon_color=%23E7E7E7&title=Reads+%28Today+%2F+All+Time%29+%3A&edge_flat=true`;

    const animateNumber = (start, end, duration, callback) => {
        const startTime = performance.now();
        const startNumber = start;
        const targetNumber = end;
        const difference = targetNumber - startNumber;

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = easeOutCubic(progress);
            const currentNumber = Math.round(startNumber + (difference * easedProgress));

            callback(currentNumber);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const fetchWithProxy = async (targetUrl) => {
        const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(targetUrl);
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
    };

    useEffect(() => {
        const updateViewCount = async () => {
            try {
                const svgText = await fetchWithProxy(counterUrl);
                const match = svgText.match(
                    /<text[^>]*fill="#fff"[^>]*>([\d\s/]+)<\/text>/
                );

                if (match && match[1]) {
                    const count = match[1].trim();
                    const totalViews = parseInt(count.split("/")[1].trim(), 10);

                    animateNumber(0, totalViews, 1000, (value) => {
                        setViewCount(value.toLocaleString());
                    });
                } else {
                    setViewCount('N/A');
                }
            } catch {
                setViewCount('N/A');
            }
        };

        updateViewCount();
    }, [url]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', }}>
            <svg class="fill-transparent w-5 h-5" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" color='#60739F' />
                <circle cx="12" cy="12" r="3" color='#60739F' />
            </svg>
            <div id="views-count" className="view-counter" style={{ color: '#60739F' }}>
                {viewCount}
            </div>
            <style jsx>{`
        @keyframes loadingDots {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }

        .loading-dot {
          animation: loadingDots 1.4s infinite;
          animation-fill-mode: both;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
        </div>
    );
};

export default ViewCounter;