export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try {
    const {messages,systemPrompt} = req.body;
    const KEY = 'AIzaSyDvGH1GUq5oXkBMe3Jlnx0KBdQczTiDIDg';
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key='+KEY,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        system_instruction:{parts:[{text:systemPrompt}]},
        contents:messages,
        generationConfig:{temperature:0.88,maxOutputTokens:500}
      })
    });
    const data = await r.json();
    if(!r.ok) return res.status(500).json({error:data.error?.message||'Error'});
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text||"Main yahan hoon.";
    return res.status(200).json({reply:text});
  } catch(e) {
    return res.status(500).json({error:e.message});
  }
      }
