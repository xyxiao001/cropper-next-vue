import container from 'markdown-it-container'
import MarkdownIt from 'markdown-it'
import striptags from './strip-tags.js'

const markdownRenderer = new MarkdownIt()

const convertHtml = (str: string) => {
  return str.replace(/(&#x)(\w{4});/gi, $0 => String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16)))
}

export default (md: MarkdownIt) => {
  md.use(container, 'demo', {
    validate: (params: string) => params.trim().match(/^demo\s*(.*)$/),
      render: (tokens, idx) => {
        if (tokens[idx].nesting === 1) {
          const html = convertHtml(striptags(tokens[idx + 1].content, 'script'))
          return `<demo>
                    <template #demo>${html}</template>
                    <template #sourceCode>`
        }
        return '</template></demo>'
      }
  })
};
