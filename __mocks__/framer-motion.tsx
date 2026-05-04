import React from 'react'

const motion = new Proxy({} as Record<string, React.FC<any>>, {
  get(_target, tag: string) {
    const Component = React.forwardRef(
      ({ children, ...props }: React.PropsWithChildren<Record<string, any>>, ref: any) => {
        const {
          initial, animate, exit, variants, transition,
          whileHover, whileTap, whileFocus, whileDrag, whileInView,
          layout, layoutId, onAnimationStart, onAnimationComplete,
          custom, viewport,
          ...domProps
        } = props
        return React.createElement(tag, { ...domProps, ref }, children)
      }
    )
    Component.displayName = `motion.${tag}`
    return Component
  },
})

const AnimatePresence = ({ children }: React.PropsWithChildren<{}>) => <>{children}</>
const useAnimation = () => ({ start: () => {}, stop: () => {}, set: () => {} })
const useMotionValue = (initial: any) => ({ get: () => initial, set: () => {} })
const useInView = () => false

export { motion, AnimatePresence, useAnimation, useMotionValue, useInView }
