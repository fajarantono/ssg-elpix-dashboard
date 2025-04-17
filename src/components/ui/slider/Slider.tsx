'use client';

import * as React from 'react';
// import * as SliderPrimitive from "@radix-ui/react-slider"

// import { cn } from "@/lib/utils"

// const Slider = React.forwardRef<
//   React.ElementRef<typeof SliderPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
// >(({ className, ...props }, ref) => (
//   <SliderPrimitive.Root
//     ref={ref}
//     className={cn(
//       "relative flex w-full touch-none select-none items-center",
//       className
//     )}
//     {...props}
//   >
//     <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
//       <SliderPrimitive.Range className="absolute h-full bg-primary" />
//     </SliderPrimitive.Track>
//     <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
//   </SliderPrimitive.Root>
// ))
// Slider.displayName = SliderPrimitive.Root.displayName

// export { Slider }

import * as SliderPrimitive from '@radix-ui/react-slider';

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  value: [number, number];
  onChange: (val: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onChange}
    >
      <SliderPrimitive.Track className="bg-gray-300 relative grow rounded-full h-1">
        <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block w-4 h-4 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Thumb ${i + 1}`}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
