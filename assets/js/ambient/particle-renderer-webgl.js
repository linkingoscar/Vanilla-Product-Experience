/**
 * Ambient Particle WebGL2 Renderer v0.1
 * --------------------------------------
 * Small framework-free point-sprite renderer. Particle simulation stays on the
 * CPU so the same state can be reused by Safari/Firefox glass mirror canvases.
 */
(function registerAmbientParticleWebGLRenderer() {
  "use strict";

  class ParticleWebGLRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });
      if (!this.gl) throw new Error("WebGL2 unavailable");

      this.width = 1;
      this.height = 1;
      this.dpr = 1;
      this.capacity = 0;
      this.bufferData = new Float32Array(0);
      this.program = this.createProgram();
      this.buffer = this.gl.createBuffer();
      this.positionLocation = this.gl.getAttribLocation(this.program, "a_particle");
      this.viewportLocation = this.gl.getUniformLocation(this.program, "u_viewport");
      this.dprLocation = this.gl.getUniformLocation(this.program, "u_dpr");
      this.opacityLocation = this.gl.getUniformLocation(this.program, "u_opacity");
      this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");

      const gl = this.gl;
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    compile(type, source) {
      const gl = this.gl;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || "Shader compilation failed";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    createProgram() {
      const gl = this.gl;
      const vertex = this.compile(gl.VERTEX_SHADER, `#version 300 es
        precision highp float;
        in vec3 a_particle;
        uniform vec2 u_viewport;
        uniform float u_dpr;
        uniform float u_opacity;
        out float v_alpha;
        void main() {
          vec2 clip = vec2(
            (a_particle.x / max(1.0, u_viewport.x)) * 2.0 - 1.0,
            1.0 - (a_particle.y / max(1.0, u_viewport.y)) * 2.0
          );
          gl_Position = vec4(clip, 0.0, 1.0);
          float depth = clamp(a_particle.z, 0.0, 1.0);
          gl_PointSize = mix(1.15, 3.15, depth) * u_dpr;
          v_alpha = u_opacity * mix(0.11, 0.44, depth);
        }
      `);
      const fragment = this.compile(gl.FRAGMENT_SHADER, `#version 300 es
        precision highp float;
        uniform vec3 u_color;
        in float v_alpha;
        out vec4 outColor;
        void main() {
          vec2 p = gl_PointCoord - vec2(0.5);
          float d = length(p) * 2.0;
          float body = 1.0 - smoothstep(0.32, 1.0, d);
          float core = 1.0 - smoothstep(0.0, 0.28, d);
          float alpha = v_alpha * (body * 0.72 + core * 0.28);
          if (alpha < 0.002) discard;
          outColor = vec4(u_color, alpha);
        }
      `);

      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) || "Program link failed";
        gl.deleteProgram(program);
        throw new Error(message);
      }
      return program;
    }

    resize(width, height, dpr) {
      this.width = Math.max(1, width);
      this.height = Math.max(1, height);
      this.dpr = Math.max(1, dpr || 1);
      const pixelWidth = Math.max(1, Math.round(this.width * this.dpr));
      const pixelHeight = Math.max(1, Math.round(this.height * this.dpr));
      if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;
      }
      this.gl.viewport(0, 0, pixelWidth, pixelHeight);
    }

    ensureCapacity(count) {
      if (count <= this.capacity) return;
      this.capacity = Math.max(count, Math.ceil(this.capacity * 1.5), 256);
      this.bufferData = new Float32Array(this.capacity * 3);
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.bufferData.byteLength, gl.DYNAMIC_DRAW);
    }

    render(particles, count, options) {
      const gl = this.gl;
      const opts = options || {};
      this.ensureCapacity(count);

      for (let i = 0; i < count; i += 1) {
        const particle = particles[i];
        const offset = i * 3;
        this.bufferData[offset] = particle.x;
        this.bufferData[offset + 1] = particle.y;
        this.bufferData[offset + 2] = particle.depth;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bufferData.subarray(0, count * 3));
      gl.enableVertexAttribArray(this.positionLocation);
      gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.uniform2f(this.viewportLocation, this.width, this.height);
      gl.uniform1f(this.dprLocation, this.dpr);
      gl.uniform1f(this.opacityLocation, opts.opacity == null ? 1 : opts.opacity);
      const color = opts.color || [0.72, 0.78, 1.0];
      gl.uniform3f(this.colorLocation, color[0], color[1], color[2]);
      gl.drawArrays(gl.POINTS, 0, count);
    }

    destroy() {
      const gl = this.gl;
      if (!gl) return;
      gl.deleteBuffer(this.buffer);
      gl.deleteProgram(this.program);
    }
  }

  window.CursorParticleWebGLRenderer = ParticleWebGLRenderer;
})();
