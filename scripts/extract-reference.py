"""Extract the supplied standalone V2 without changing its composition."""
import base64,json,re
from pathlib import Path
source=Path('todo-mascota-premium-v2.html').read_text()
scripts=re.findall(r'<script[^>]*>(.*?)</script>',source,re.S)
assets=json.loads(scripts[1].removeprefix('window.PET_ASSETS=').rstrip(';'))
replacements={}
for name,data in assets.items():
    header,encoded=data.split(',',1)
    path=f'/assets/{name}.jpg'
    Path('public'+path).write_bytes(base64.b64decode(encoded));replacements[data]=path
css=re.search(r'<style[^>]*>(.*?)</style>',source,re.S).group(1)
def font(match):
    name=f'font-{len(fonts)+1}.woff2';data=match.group(0)
    if data not in fonts:
        fonts[data]='/assets/'+name
        Path('public/assets/'+name).write_bytes(base64.b64decode(data.split(',',1)[1]))
    return fonts[data]
fonts={}
css=re.sub(r'data:font/woff2;base64,[A-Za-z0-9+/=]+',font,css)
# Accept alternative embedded MIME types used by the supplied document.
css=re.sub(r'data:application/(?:font-woff|octet-stream|x-font-woff);base64,[A-Za-z0-9+/=]+',font,css)
Path('src/styles/style.css').write_text(css+'\n.reference-section{display:contents}\n')
body=re.search(r'<body[^>]*>(.*?)</body>',source,re.S).group(1)
body=re.sub(r'<script.*?</script>','',body,flags=re.S)
for data,path in replacements.items():body=body.replace(data,path)
header,content=body.split('<main>',1)
main,footer=content.split('</main>',1)
regions={'header':header,'footer':footer}
for match in re.finditer(r'<section class="([^"]+)".*?</section>|<div class="chapter-strip".*?</div>',main,re.S):
    name=match.group(1).split()[0] if match.group(1) else 'chapter-strip'
    regions[name]=match.group(0)
Path('src/lib/reference-markup.json').write_text(json.dumps(regions,ensure_ascii=False))
Path('public/assets/lucide.js').write_text(scripts[0])
app=scripts[2].replace('(()=>{','export function initializeExperience(){',1)
app=app.rsplit('})();',1)[0]+'}\n'
app=app.replace("window.PET_ASSETS?.[key]||'assets/'+key+'.jpg'","'/assets/'+key+'.jpg'")
app=app.replace('La conexión con Olivia IA se integrará durante el desarrollo.','Sin conexión IA en esta vista previa.')
app=app.replace("'use strict';", "'use strict';\nconst cleanups=[];\nconst listen=(target,event,handler)=>{target.addEventListener(event,handler);cleanups.push(()=>target.removeEventListener(event,handler))};",1)
app=app.replace("document.addEventListener('click',", "listen(document,'click',")
app=app.replace("modal.addEventListener('click',", "listen(modal,'click',")
app=app.replace("const observer=new IntersectionObserver", "const observer=new IntersectionObserver")
app=app.replace("$$('.manifesto h2,.universe-head,.travel-heading,.life-heading,.memory-copy h2').forEach", "cleanups.push(()=>observer.disconnect());$$('.manifesto h2,.universe-head,.travel-heading,.life-heading,.memory-copy h2').forEach")
app=app.rsplit('}',1)[0]+"return ()=>{cleanups.forEach(cleanup=>cleanup());document.querySelectorAll('button,input,form,a').forEach(node=>{node.onclick=null;node.oninput=null;node.onchange=null;node.onsubmit=null;node.onkeydown=null;});if(modal.open)modal.close();};\n}\n"
Path('src/lib/app.js').write_text(app)
