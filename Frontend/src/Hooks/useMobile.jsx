import { useEffect, useState } from "react"

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(breakpoint < window.innerWidth)

    function adjustResize() {
        setIsMobile(window.innerWidth < breakpoint)
    }

    useEffect(() => {
        adjustResize()
        window.addEventListener("resize", adjustResize);

        return () => {
            window.removeEventListener("resize", adjustResize)
        }
    }, [])

    return [ isMobile ]
}

export default useMobile;