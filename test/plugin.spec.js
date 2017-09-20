import BabelInlineImportDataURI from '../plugin';
import * as babel from 'babel-core';

describe('Babel Inline Import - Plugin', () => {
  describe('Babel Plugin', () => {
    [
      [
        'example.svg',
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjM0MXB4IiBoZWlnaHQ9Ijk2cHgiIHZpZXdCb3g9IjAgMCAzNDEgOTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+TG9nbzwvdGl0bGU+CiAgICA8ZyBpZD0iTG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy4wMDAwMDAsIDQuMDAwMDAwKSI+CiAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZSIgc3Ryb2tlLXdpZHRoPSIxNCI+CiAgICAgICAgICAgIDx1c2Ugc3Ryb2tlPSIjREU0RDVGIiBtYXNrPSJ1cmwoI21hc2stMikiIGZpbGw9IiMyODIwMjgiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgIDx1c2Ugc3Ryb2tlPSIjMjgyMDI4IiBtYXNrPSJ1cmwoI21hc2stMykiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+",
      ],
      [
        'example.png',
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAHxUlEQVRYw+2WaWxU1x3Fz733zZs3u2e8jMce7/GCMa6NGxaXrTTU0Bpo1CQqbYmCClUgVVupUkKrVvRb1VZKlVQJSUqkClAFtCVVIaEFAoRSQ4BgwDa242Vsj/Eyw+wzz+/NW24/UEWpGuVDqVSp4vftXukvHZ2r/7kHeMhD/seQT7qcKT38L+eDjigY58zOGTIMxt7R7/33BEyXHgQBrAD4dUnNR5hebOd0W21ejBca9GSPTbEKIJ0E6HYZNF2XZ7/OMTLuV/KouvftBxYgnLPlPA2a9HWF8GyamgmJs90GyMYRi54MUb6ZmLzR5GhKMsN6z8K5TkRLkuovDIs09/LCbnw3t//BHDhc+/pmCnIoQnRJAgVo3jpoiyMaSCHTMgQjpyNak4XMDdSdX4LNwytUOyHHNWIcJDAvi57alDL/AXbM/Og/c0DgtDpBVecfV5xmnkgRNIeK6zvehW3ehQWWRuF4EOM7+4CYgYWpHJyKYK1LFWyryVZskUzxupGaeOmZGf6Wo3I/zQkolzgteURlwyGJZtekdJTGPv2ZBBGkMkk1NrqlDwslGTjueBDbOAfPqTyITOAdKkHjK49CjyrQnSpO/PgovH1F2HL4aUdNtmRtUGMFJ6v9VKdmpwhsylPunxL5Oc71F99xa9d+635FNwydJgRTMAjROWDuHfv+xx1A9QIorEkn5rZOILskhbKTtaBpBvcdHzLVCVhmRPhSNchUxDAbnESsLIK5P+XAFR1OnbcohBxKM9gSzECCGSg02BOVeWG1CMufDcLjErGUB4Aiu0HO+nTyxrmKA5n14Z33BWSJqVVoVvgiLpDDLQjebkJZbz2sOSe4bkIWEqBEgE7zMHgey/dtxmznKAyuYd45gT9U9TNvtsZWHG+GRk1wADLVIRPur9SEXVZOkSAmknQBHmpdnyfC4hwx971ZfyDsy6TAun1fHrGDLreHCwPu3kUIDjVDUp0QdQnR4glcfP53UEgaw09ehe9WKbQCBe7JIkyt6Md49Q1MLg9BEXUExppACP0oWHKUIy6YCLMkzndcwLvbTkGZt7OyRGmbA3QF4eaoRvgUW1LxxHyRpk+qmrOL6DZHnpn/jCeCnDOJwZ2XEVs5i3yJAjOqIdI1Be+gH7NLR+AdCaBqrBXBO02wq16Qj+UaAYFJCDIsjff3nMDc9kmkpDjcVxqJ07BVODj9IihLsoP08Q4HZ6064asMApcBwAQBJ4BsSyLuuYvmY6uRKYrBM1iEyIYwKs8shnesFLFgGI0XV8KfrgVn5kcCCCfQoEBhWVh0K1LWCKLrwpCrUnBdKwGLlsPOibtWs6QFysn0PaZ7APQENaHer6P1SvEMVNUBT9yP1a9/DaJhR8G0HyTNoR3PQ5QlWGQPWI2AoU1/B5XehyPjRctf14Fwgpg7jGvfPIl0XQzuPh9iK2dBKIHpMTG1ZhCf6V0GhynOWTiOC1M8EbVr1l/qlNtECIfv2TKtb//wEDQnELhWi/ZjXbBoVujlGuTKFJYd3QqDaTj98wNIfy4OUzIBAJ4bRfD2+lE204iB7r8h/ugcKi82I7TxFgxNQ8lfKpFpiePuxmGYR8NwhJqVD0VtSCgjHo8O8tm7UNcrwIYB/ywiHXPQylUkl8wj0FuHSNsU+vZcgMEMlL96E84ZH1SXDJIhoDpF4QflsIwJuPnUGdhecyFRPYuKE41oeXsN5trHoKUVtOxfjf69lzC/bgIDq/qxLNQUsHDSybZ6uwvmBPPFJDO3Dwqq5craHoS/MgxQwJQMzLWHMN01BN2hg5gE1n4JM9vG4HjPhaW/2gDFmUXhaDkqLzRj9MkbuNs2hExVDKnFMUx8/jaUQhn5qgVMf2kE2YY4iEZAsg60XmoV3Jpljn4oLkQjgvGWlVNZEnKYeKwfRCaQ+iRwxpGtT8DEfZuts3ZUXWkB1RlomQVl84vgmi5EsmYeYkqCVqJBXpKDpDph2DWUjFZj7U+/geD5JhBQdL65Es8+8ywee+lxWPOWtNuk7wndOU/dqEWPhARDHmkYccRWzKK4J4DiU0EM/6AXpaerYQmLCL0wAEfIg4qxRgzLV5FqjyPUcfP+upalwDkHzTM8cqQdFbfqce4XR1B/vh3tt9tQPV4D5TdZrIiWwqvaRkSCRJ4aPZTzE0KMmX6ZmvsyxCieKUhADEv4wpFONN1swvxAG1i4Dpc2nQbsA/Des2FlNIjoiUXIVKTREC7DSFEGcsSKqpQHvoFCeFIU6/ub4Hx+O4ITVWg2BFPOeGWe8dlsHBOqoO9albMND4pGoj4vqORY1X6XyuhTBORbEUHuiLuiYnnGF3dp7suUk3KZGIveab1ovd19Ay1X67D5bNeVpEW+6FJFeLlrzah3ujwjySMN0Upzsii8VFLsLJDxj6mglaC8SAI579bJzxyceGeYFhqhueu1po3vCD13PzOOVL0KUbRjQVcKPaali3PSERX06xmiHJcguApMYavKzd0K9Go7hESO8d0Gwdk9y0bw+55Gv2FIzkA8MKsUzhDFoItTFk1QWX6oWbU+HRWMr8aY8ROD4EJDzsC62ef+vZB82l99pvw1tC1QnHOb/lJDrGYg8ZvWhZDDJPqO8d2fODNa9DIIKBEFd/GUkDeviXLcwam5K/SdB2pOD3nI/y//AJ2fkbEb2IXgAAAAAElFTkSuQmCC",
      ],
    ].forEach(([filename, base64data]) => {
      it('transforms the import statement into a variable with the intended content', () => {
        const transformedCode = babel.transform(`import SomeExample from './fixtures/${filename}';`, {
          filename: __filename,
          plugins: [[
            BabelInlineImportDataURI, {
              extensions: [
                '.svg',
                '.png',
              ]
            }
          ]]
        });

        expect(transformedCode.code).to.equal(`/* babel-plugin-inline-import './fixtures/${filename}' */var SomeExample = '${base64data}';`);
      });
    });

    it('accepts different extensions', () => {
      const transformedCode = babel.transform("import SomeExample from './fixtures/example.py';", {
        filename: __filename,
        plugins: [[
          BabelInlineImportDataURI, {
            extensions: [
              '.py'
            ]
          }
        ]]
      });

      expect(transformedCode.code).to.equal('/* babel-plugin-inline-import \'./fixtures/example.py\' */var SomeExample = \'data:application/octet-stream;base64,cHJpbnQgMSArIDEK\';');
    });

    it('throws error when importing with destructuring', () => {
      expect(() => {
        babel.transform("import { SomeExample, AnotherExample } from './fixtures/example.svg';", {
          filename: __filename,
          plugins: [BabelInlineImportDataURI]
        });
      }).to.throw(Error);
    });
  });
});
