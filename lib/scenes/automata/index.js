function render(pixels, t, state) {
if(!state.p)
{
state.p=[]
state.A=[]
state.f=0
state.qLast=state.qLastLast=0
}
with(state)
{
py=f%32>15?15-f%16:f%16;
py*=16

for(q=i=0;i<16*15;i++)
p[i]=p[i+16],
q+=(i/16|0)==14?p[i]:0,
q-=(i/16|0)==13?p[i]:0

if(f%16==0)
if ((q+16)%16==0||q==qLastLast||f%(16*16)==0)
r=Math.random()*255|0
f++

qLastLast=qLast
qLast=q

for(a=i=0;i<16;i++)
A[i]=r&2**(4*a+2*(a=!!A[i])+!!A[(i+1)%16]),

p[i+15*16]=!a

for(i=16*16;i--;)
pixels[i]=p[i]?1:0
}
//FF2020
}


module.exports = {
  render
};
