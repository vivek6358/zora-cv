"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type AnimatedShaderBackgroundProps = {
  className?: string;
};

export default function AnimatedShaderBackground({
  className = "",
}: AnimatedShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(1);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 0.7) * 0.003, cos(iTime * 1.1) * 0.003);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 2.2, 0.0)) * 0.5;

          for (float i = 0.0; i < 18.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 1.7 + i) * 0.003, cos(iTime * 2.0 - i) * 0.003);
            float tailNoise = fbm(v + vec2(iTime * 0.35, i)) * 0.3 * (1.0 - (i / 18.0));
            vec4 auroraColors = vec4(
              0.18 + 0.22 * sin(i * 0.2 + iTime * 0.25),
              0.42 + 0.35 * cos(i * 0.3 + iTime * 0.3),
              0.88 + 0.12 * sin(i * 0.4 + iTime * 0.2),
              1.0
            );
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 18.0) * 0.55;
            o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
          }

          o = tanh(pow(o / 100.0, vec4(1.6)));
          vec3 color = mix(vec3(0.23, 0.62, 0.95), vec3(0.62, 0.22, 0.95), o.b);
          color = mix(color, vec3(0.05, 0.74, 0.62), o.g * 0.45);
          float alpha = clamp((o.r + o.g + o.b) * 0.42, 0.0, 0.32);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const quality = window.innerWidth < 768 ? 0.45 : 0.58;
      const renderWidth = Math.max(1, Math.floor(width * quality));
      const renderHeight = Math.max(1, Math.floor(height * quality));
      renderer.setSize(renderWidth, renderHeight, false);
      material.uniforms.iResolution.value.set(renderWidth, renderHeight);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);

    let frameId = 0;
    let lastRender = 0;
    const clock = new THREE.Clock();
    const animate = (now = 0) => {
      const delta = Math.min(clock.getDelta(), 0.033);
      if (now - lastRender >= 33) {
        material.uniforms.iTime.value += delta;
        renderer.render(scene, camera);
        lastRender = now;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      renderer.domElement.remove();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
