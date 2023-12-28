import { useState } from "react";
import { card, wrapper } from "./app.css";
import { MotionStyle, motion } from "framer-motion";

const items = [
  { title: "1", color: "orange" },
  { title: "2", color: "red" },
  { title: "3", color: "green" },
  { title: "4", color: "blue" },
  { title: "5", color: "pink" },
  { title: "6", color: "yellow" },
];

function Card({
  title,
  color,
  size,
  selected,
  hideLeft,
  hideRight,
}: {
  title: string;
  color: string;
  size: "md" | "lg";
  selected: boolean;
  hideLeft: boolean;
  hideRight: boolean;
}) {
  const styles: MotionStyle = {
    background: color,
  };

  return (
    <motion.div
      style={styles}
      layout
      className={card({
        size,
        selected,
        hideLeft,
        hideRight,
      })}
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

function App() {
  const [selected, setSelected] = useState(0);

  const [slides, setSlides] = useState(
    getIndexes(selected).map((idx) => ({
      key: `${idx}-${Math.random()}`,
      idx,
      item: items[idx],
    })),
  );

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

  return (
    <div className="App">
      <button onClick={handlePrev}>Prev</button>
      <motion.div className={wrapper} layout>
        {slides.map((val, i) => {
          const item = val.item;

          return (
            <Card
              hideLeft={i === 0}
              key={val.key}
              title={item.title}
              color={item.color}
              size={selected === val.idx ? "lg" : "md"}
              selected={selected === val.idx}
              hideRight={i === slides.length - 1}
            />
          );
        })}
      </motion.div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default App;
