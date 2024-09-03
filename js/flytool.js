/*
    Only for tool palette
*/

//tool palette shapes declare
const json_palette =    `{  "item1" : { "type": "circle" , "cx": 50, "cy": 210, "r": 25 , "s" : 0 , "f": "rgb(255,0,0)" , "sw" : 0 , "name" : "END"} ,
                            "item2" : { "type": "rect" , "width": 50, "height": 30, "x": 20, "y": 50 ,"rx":"10","ry":10, "s" : 0 , "f": "rgb(0,255,0)" , "sw" : 0 , "name": "START" },    
                            "item3" : { "type": "rect" , "width": 50, "height": 30, "x": 20, "y": 120 , "s" : 0 , "f": "rgb(0,0,255)" , "sw" : 0 , "name": "DECISION" },    
                            "item4" : { "type": "line" , "x1": 20, "y1": 23 , "x2": 70 , "y2": 40, "style":"stroke:yellow;stroke-width:2" , "name": "CONNECTOR" } 
                        }`;
const angle =   {
                    CW0 : 0,
                    CW360 : 2 * Math.PI,
                    CW90 : Math.PI / 2,
                    CW180 : Math.PI,
                    CW270 : 0.75 * Math.PI
                };

var palette_items = JSON.parse(json_palette);

function CE(type){
    const e = document.createElementNS('http://www.w3.org/2000/svg',type);
    return e;
}

function SA(e,k,v){
    return e.setAttribute(k,v);
}


window.onload = init;

function init(){

    const svg_palette = document.getElementById("palette");
   
    console.log("Initializing started..."); 
    for (const key in palette_items) {
            const i = palette_items[key];
            // if(i.type === "circle"){
                const s = new Shape(i);
                console.log(i);
                const rshape = new Renderer(s.prep());  
                console.log(rshape);
                svg_palette.append(rshape.draw());              
            // }            
    };
    console.log("Initializing complete...");   
    
}

class Shape {
    constructor(item){
        this.item = item;
    }    
    prep(){
        let d = {};
        for(let k in this.item){
            const v = this.item[k];
            // if(k == "type" || k == "name") {continue};
            if(k == "s") { k = "stroke"};
            if(k == "sw") { k = "stroke-width"};
            if(k == "f") { k = "fill"};
            d[k] = v;
        }
        console.log(d);
        return d ;
    }
}

class Renderer {
    constructor(data){
        this.data = data;
    }
    draw(){             
        const e = CE(this.data.type);
        const d = this.data;
        console.log(d);
        for (let k in d){
            if(k == "type" || k == "name") {continue};
            SA(e,k,d[k]);
        }
        return e;
    }
}



class Grid{

    //Based on size of tool palette 
    // create a grid with specific gap btw items vertically.


};


class RenderGrid{

    
};








