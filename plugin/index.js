import mime from 'mime-types';
import BabelInlineImportHelper from './helper';

export default function({ types: t }) {
  class BabelInlineImportDataURI {
    constructor() {
      return {
        visitor: {
          ImportDeclaration: {
            exit(path, state) {

              const givenPath = path.node.source.value;
              let reference = state && state.file && state.file.opts.filename;
              const extensions = state && state.opts && state.opts.extensions;

              if (BabelInlineImportHelper.shouldBeInlined(givenPath, extensions)) {
                if (path.node.specifiers.length > 1) {
                  throw new Error(`Destructuring inlined import is not allowed. Check the import statement for '${givenPath}'`);
                }

                // Here we detect the use of Meteor by checking global.meteorBabelHelpers
                if(global.meteorBabelHelpers && BabelInlineImportHelper.hasRoot(reference)) {
                  reference = BabelInlineImportHelper.transformRelativeToRootPath(reference);
                }

                const id = path.node.specifiers[0].local.name;
                const content = BabelInlineImportHelper.getContents(givenPath, reference);
                const mimeType = mime.lookup(givenPath) || 'application/octet-stream';
                const dataURI = `data:${mimeType};base64,` + new Buffer(content, 'binary').toString('base64');
                const variable = t.variableDeclarator(t.identifier(id), t.stringLiteral(dataURI));

                path.replaceWith({
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [variable],
                  leadingComments: [
                    {
                      type: 'CommentBlock',
                      value: ` babel-plugin-inline-import '${givenPath}' `
                    }
                  ]
                });
              }
            }
          }
        }
      };
    }
  }

  return new BabelInlineImportDataURI();
}
