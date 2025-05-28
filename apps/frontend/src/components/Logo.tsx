import React from 'react'
import Image from 'next/image'
import LogoPng from "@/assets/logo.png"

type LogoProps = {
    width?: number;
    height?: number;
}

const Logo = ({ width = 50, height = 50 }: LogoProps) => {
    return (
        <Image src={LogoPng} alt="Shared Clipboard Logo" width={width} height={height} />
    )
}

export default Logo