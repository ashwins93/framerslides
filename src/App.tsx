import { useEffect, useRef, useState } from "react";
import { card, wrapper } from "./app.css";
import { MotionStyle, TargetAndTransition, motion } from "framer-motion";

import { Dialog, DialogContent, DialogOverlay } from "@reach/dialog";
import "@reach/dialog/styles.css";

const items = [
  { title: "1", color: "orange" },
  { title: "2", color: "red" },
  { title: "3", color: "green" },
  { title: "4", color: "blue" },
  { title: "5", color: "pink" },
  { title: "6", color: "yellow" },
];

const SIZES = {
  lg: {
    width: 250,
  },
  md: {
    width: 190,
  },
};

function Card({
  title,
  color,
  size,
  selected,
  x,
  z,
}: {
  title: string;
  color: string;
  size: "md" | "lg";
  selected: boolean;
  x: string;
  z: number;
}) {
  const height = (SIZES[size].width / 16) * 9;
  const styles: MotionStyle = {
    // aspectRatio: "16/9",
    // zIndex: selected ? 1 : 0,
    width: SIZES[size].width,
    height,
    position: "absolute",
    top: `calc(50% - ${height / 2}px)`,
    left: `calc(50% + ${x})`,
    background: color,
    // transitionEnd: {
    zIndex: z,
  };

  return (
    <motion.div
      style={styles}
      // initial={false}
      // animate={animate}
      transition={{
        type: "spring",
        bounce: 0.25,
        // duration: 10,
      }}
      layout
      // className={card({
      //   size,
      //   selected,
      //   hideLeft,
      //   hideRight,
      // })}
    >
      {title}
    </motion.div>
  );
}

const getPrev = (current: number, total: number, count: number) => {
  const result = current - count;
  return result >= 0 ? result : total + result;
};

const getNext = (current: number, total: number, count: number) => {
  return (current + count) % total;
};

const getIndexes = (current: number) => [
  getPrev(current, items.length, 3),
  getPrev(current, items.length, 2),
  getPrev(current, items.length, 1),
  current,
  getNext(current, items.length, 1),
  getNext(current, items.length, 2),
  getNext(current, items.length, 3),
];

const CENTER = 3;

function App() {
  const [selected, setSelected] = useState(0);

  const [dialog, setDialog] = useState(false);
  const [maxOffset, setMaxOffset] = useState(0);

  const [slides, setSlides] = useState(
    getIndexes(selected).map((idx) => ({
      key: `${idx}-${Math.random()}`,
      idx,
      item: items[idx],
    }))
  );

  const constraintRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setSelected((prev) => (prev + 1) % items.length);
    setSlides((prev) => {
      const newSlides = prev.slice(1);
      const lastItem = newSlides[newSlides.length - 1];
      const nextItemIdx = getNext(lastItem.idx, items.length, 1);
      newSlides.push({
        key: `${nextItemIdx}-${Math.random()}`,
        idx: nextItemIdx,
        item: items[nextItemIdx],
      });
      return newSlides;
    });
  };

  const handlePrev = () => {
    setSelected((prev) => (prev - 1 < 0 ? items.length + prev - 1 : prev - 1));
    setSlides((prev) => {
      const newSlides = prev.slice(0, prev.length - 1);
      const firstItem = newSlides[0];
      const prevItemIdx = getPrev(firstItem.idx, items.length, 1);
      newSlides.unshift({
        key: `${prevItemIdx}-${Math.random()}`,
        idx: prevItemIdx,
        item: items[prevItemIdx],
      });
      return newSlides;
    });
  };

  useEffect(() => {
    setMaxOffset(
      (constraintRef.current?.clientWidth ?? 0) -
        (constraintRef.current?.scrollWidth ?? 0)
    );
  }, []);

  return (
    <>
      <div className={wrapper}>
        <button style={{ position: "absolute", top: 0 }} onClick={handlePrev}>
          Prev
        </button>
        {/* <motion.div className={wrapper} layout> */}
        {slides.map((val, i) => {
          const item = val.item;
          const direction = i < CENTER ? -1 : 1;
          const distanceFromCenter =
            Math.abs(CENTER - i) - (direction === 1 ? 1 : 0);

          const posX = `${
            direction * SIZES.md.width * distanceFromCenter +
            direction * distanceFromCenter * 20 +
            direction * 20
          }px`;

          return (
            <Card
              x={i === CENTER ? `-${SIZES.lg.width / 2}px` : posX}
              z={10 - Math.abs(CENTER - i)}
              key={val.key}
              title={item.title}
              color={item.color}
              size={selected === val.idx ? "lg" : "md"}
              selected={selected === val.idx}
            />
          );
        })}
        {/* </motion.div> */}
        <button
          style={{ position: "absolute", top: 0, right: 0 }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <motion.div
          ref={constraintRef}
          style={{ display: "flex", gap: 20 }}
          drag="x"
          dragElastic={0}
          dragTransition={{
            timeConstant: 150,
            power: 0.5,
            modifyTarget: (target) => Math.round(target / 320) * 320,
          }}
          dragConstraints={{
            left: maxOffset,
            right: 0,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            return (
              <div
                key={i}
                style={{
                  width: 300,
                  height: 150,
                  background: "orangered",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </motion.div>
      </div>
    </>
  );
}

export default App;
