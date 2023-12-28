import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

globalStyle("html, body", {
  margin: 0,
});

globalStyle("body", {
  fontFamily: "sans-serif",
});

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  position: "relative",
  margin: "0 auto",
  width: "min-content",
  gap: 8,
});

export const card = recipe({
  base: {
    aspectRatio: "16/9",
    flexShrink: 0,
  },

  variants: {
    size: {
      lg: {
        width: 250,
      },
      md: {
        width: 190,
      },
    },
    selected: {
      true: {
        zIndex: 10,
      },
    },
    hideLeft: {
      true: {
        position: "absolute",
      },
    },
    hideRight: {
      true: {
        position: "absolute",
      },
    },
  },

  compoundVariants: [
    {
      variants: {
        size: "md",
        hideLeft: true,
      },
      style: {
        left: -198,
      },
    },
    {
      variants: {
        size: "lg",
        hideLeft: true,
      },
      style: {
        left: -258,
      },
    },
    {
      variants: {
        size: "md",
        hideRight: true,
      },
      style: {
        right: -198,
      },
    },
    {
      variants: {
        size: "lg",
        hideRight: true,
      },
      style: {
        right: -258,
      },
    },
  ],
});
