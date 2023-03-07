import { cva, VariantProps } from 'class-variance-authority'

type HeadingOneProps = VariantProps<typeof headingOne> & {
  children: JSX.Element | string
  intent?: string | undefined
}

const headingOne = cva('text-white text-xl xl:text-4xl lg:text-3xl md:text-2xl text-center', {
  variants: {
    intent: {
      extraBold: 'font-extrabold',
      semiBold: 'font-semibold',
      medium: 'font-medium',
      light: 'font-light',
      thin: 'font-thin',
    },
  },
  defaultVariants: {
    intent: 'medium',
  },
})

export default function HeadingOne({ children, intent }: HeadingOneProps) {
  return <h1 className={headingOne({ intent })}>{children}</h1>
}
