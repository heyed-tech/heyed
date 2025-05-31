import type React from "react"
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  fullWidth?: boolean
}

export function Container({ children, className, fullWidth = false, ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${
        fullWidth
          ? "px-8 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
          : `${className?.includes("faq") ? "max-w-none" : "max-w-7xl 2xl:max-w-[1600px]"} px-8 sm:px-8 md:px-12 lg:px-16`
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  )
}
