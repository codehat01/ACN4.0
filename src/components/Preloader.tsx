import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Loader = ({ onFinish }: { onFinish?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsFinished(true); // trigger fade out
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // When animation ends, call onFinish
  const handleAnimationEnd = () => {
    if (isFinished && onFinish) onFinish();
  };

  return (
    <StyledWrapper
      $isFinished={isFinished}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="loader-wrapper">
        <div className="loader" />
        <div className="progress-text">Loading... {progress}%</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $isFinished: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #151515;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  opacity: ${(props) => (props.$isFinished ? 0 : 1)};
  animation: ${(props) =>
    props.$isFinished ? "fadeOut 1s ease-in forwards" : "none"};

  .loader-wrapper {
    position: relative;
    display: inline-block;
  }

  .loader {
    font-size: clamp(4rem, 16vw, 400px);
    font-family: system-ui, sans-serif;
    font-weight: bold;
    text-transform: uppercase;

    @media (max-width: 768px) {
    
      font-size: 30vw;
    }


    /* Outline stroke */
    -webkit-text-stroke: 1px #000;
    paint-order: stroke fill;
    color: transparent;

    /* Gradient fill */
    background: radial-gradient(0.71em at 50% 1em, #b22049 99%, transparent 101%)
        calc(50% - 1em) 1em / 2em 200% repeat-x,
      radial-gradient(0.71em at 50% -0.5em, transparent 99%, #b22049 101%) 50%
        1.5em / 2em 200% repeat-x;

    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; 

    animation: l10-0 3s linear infinite alternate, l10-1 4s linear 1;
  }

  .loader:before {
    content: "ACN";
  }

  .progress-text {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-family: system-ui, sans-serif;
    letter-spacing: 2px;
  }

  @keyframes l10-0 {
    to {
      background-position-x: 50%, calc(50% + 1em);
    }
  }

  @keyframes l10-1 {
    to {
      background-position-y: -0.5em, 0;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export default Loader;
