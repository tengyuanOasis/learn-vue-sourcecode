/* @flow */

import { parse } from "./parser/index";
import { optimize } from "./optimizer";
import { generate } from "./codegen/index";
import { createCompilerCreator } from "./create-compiler";

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options);
  console.log(
    "%c [ ast ]-16",
    "font-size:13px; background:#0094fb; color:#fff;",
    ast
  );
  if (options.optimize !== false) {
    // optimize 函数会对 AST 进行优化处理，以提高 Vue 应用的运行性能。
    // 例如，它会移除一些不必要的节点，优化指令的执行顺序等。
    // 静态节点提升： 将静态节点提升为静态根节点，以减少虚拟 DOM 的重复渲染和对比操作，从而提高渲染性能。
    // 静态节点标记： 将静态节点标记为静态，以减少虚拟 DOM 的渲染和对比操作。
    // 静态事件提升： 将静态事件处理函数提升到父元素上，以减少事件绑定的数量，提高事件处理的效率。
    // 条件表达式优化： 对条件表达式进行简化和优化，以减少运行时的计算量。
    // 纯文本节点提升： 将纯文本节点提升为静态文本节点，以减少虚拟 DOM 的重复渲染和对比操作。
    // 优化后的 AST 将被传递给 generate 函数，用于生成最终的渲染函数代码。
    optimize(ast, options);
  }
  //  通过generate将ast转化为可执行函数code ，返回 { render, staticRenderFns}
  const code = generate(ast, options);
  console.log(
    "%c [ code ]-34",
    "font-size:13px; background:#0094fb; color:#fff;",
    code
  );
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
