import "./Blog.css"
import {gsap} from "gsap/gsap-core"
import { useGSAP } from "@gsap/react";
export default function Blog() {
    useGSAP(()=>{
        gsap.to(".svg-rotate",{
            rotate: 90,
            duration: 0.2,
            ease: "sine.inOut",
            repeat: -1,
            repeatDelay: 1
        })
    })
    return(
        <section className="blog-section">
            <div className="blog-section-pending">  
                <h2 className="blog-h2">
                    <span>C</span>
                    <span><svg className="svg-rotate svg-rotate-style-blog" viewBox="0 0 137 135" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ariaHidden="true">
<path d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z" fill="url(#paint0_linear_1655_45397)"></path>
<path d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z" fill="url(#pattern-home-hero-windmill-0)" fillOpacity="0.6" style={{mixBlendMode:"multiply"}}></path>
<defs>
<pattern id="pattern-home-hero-windmill-0" patternContentUnits="objectBoundingBox" width="1.45985" height="1.48148">
<use xlinkHref="#svg-noise" transform="scale(0.00291971 0.00296296)"></use>
</pattern>
<linearGradient id="paint0_linear_1655_45397" x1="-76.6791" y1="-15.6157" x2="165.682" y2="81.0082" gradientUnits="userSpaceOnUse">
<stop offset="0.427083" stopColor="#FF8709"></stop>
<stop offset="0.791667" stopColor="#F7BDF8"></stop>
</linearGradient>
</defs>
</svg>
</span>
                    <span>o</span>
                    <span>m</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span> <span>S</span>
                    <span>o</span>
                    <span>o</span>
                    <span>n</span>
                    <span>...</span>
                    </h2>
            </div>
        </section>
    );
}