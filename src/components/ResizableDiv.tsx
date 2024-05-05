import React, { ReactNode, useEffect, useState } from "react";
import "../style/resizableDiv.scss"; // Make sure to create this CSS file

interface ResizableDivProps {
  content: ReactNode; // This prop allows you to pass any ReactNode as children
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  // minWidth: number;
  // maxWodth: number;
}

const ResizableDiv: React.FC<ResizableDivProps> = ({
  initialWidth,
  content,
  minWidth = 100, // Default minimum width
  maxWidth = 1000, // Default maximum width
}) => {
  const [width, setWidth] = useState(initialWidth); // Initial width
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        // Calculate the new width
        const dx = e.clientX - startX;
        const newWidth = Math.max(minWidth, Math.min(width + dx, maxWidth)); // Constrain new width between min and max
        setWidth(newWidth);
        setStartX(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.userSelect = "";
      }
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (!isResizing) {
        document.body.style.userSelect = "";
      }
    };
  }, [isResizing, startX, width, minWidth, maxWidth]);

  const startResizing = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    setStartX(mouseDownEvent.clientX);
    setIsResizing(true);
    document.body.style.userSelect = "none";
  };

  return (
    <div className="resizable" style={{ width: `${width}px` }}>
      <div className="content">{content}</div>
      <div className="resizer" onMouseDown={(e) => startResizing(e)}></div>
    </div>
  );
};

export default ResizableDiv;
