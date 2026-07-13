/**
 * 复制文本到剪贴板,并通过 Toast 提示用户
 * @param toCopy 需要复制的文本
 * @param message 复制成功后 toast 显示的文案,默认为 "Copied to clipboard"
 */

export function copyToClipboard(toCopy: string, message: string = 'Copied to clipboard') {
  // 获取 Nuxt UI 的 Toast API (由 UApp 自动注入)
  const toast = useToast()
  // 调用浏览器剪贴板 API 异步写入,成功后弹出成功提示
  navigator.clipboard.writeText(toCopy).then(() => {
    toast.add({ title: message, color: 'success', icon: 'i-lucide-check-circle' })
  })
}
