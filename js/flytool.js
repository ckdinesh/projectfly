//tool palette shapes declare
const json_palette =    `{  
                            "item1" : { "type": "rect" , "width": 60, "height": 40, "x": 20, "y": 70 ,"rx":"30","ry":30, "s" : 0 , "f": "rgb(84,141,68)" , "sw" : 0 , "name": "START" },
                            "item2" : { "type": "rect" , "width": 60, "height": 40, "x": 20, "y": 140 , "s" : 0 , "f": "rgb(102,119,204)" , "sw" : 0 , "name": "DECISION" },    
                            "item3" : { "type": "circle" , "cx": 50, "cy": 240, "r": 30 , "s" : 0 , "f": "rgb(183,6,6)" , "sw" : 0 , "name" : "END"} ,
                            "item4" : { "type": "line" , "x1": 20, "y1": 40 , "x2": 80 , "y2": 40, "style":"stroke:yellow;stroke-width:2" , "name": "CONNECTOR" } 
                        }`;
const angle =   {
                    CW0 : 0,
                    CW360 : 2 * Math.PI,
                    CW90 : Math.PI / 2,
                    CW180 : Math.PI,
                    CW270 : 0.75 * Math.PI
                };

var palette_items = JSON.parse(json_palette);
var currentElementSelection = undefined;
const selectionStyle = {"stroke":"yellow","stroke-width":"5","stroke-opacity":"0.4"};
var selectedElement, offset, transform = undefined;
const PALETTE_SIZE = {"WIDTH": 100 , "HEIGHT" : 600};


function CE(type){
    const e = document.createElementNS('http://www.w3.org/2000/svg',type);
    return e;
};

function SA(e,k,v){
    return e.setAttribute(k,v);
};

function HA(e,k){
    return e.hasAttribute(k);                
};

function GA(e,k){
    return e.getAttribute(k);
};

function RA(e,k){
    e.removeAttribute(k);
};

function random() {
    return Math.floor((Math.random() * 100000));
};

function innerDisplay(e, t, x ,y){    
    const grp = CE('g'); 
    const el = textadd(t,x, y, "white");
    grp.append(e); 
    grp.append(el);
    return grp;
};

function getMousePosition(evt) {
    var svg = evt.target;
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
}


function textadd(val,x, y, shade){
    const txt = document.createElementNS('http://www.w3.org/2000/svg','text');      
    txt.setAttribute("x", x);
    txt.setAttribute("y", y);
    txt.setAttribute("fill", shade);
    txt.setAttribute("font-size", 10);
    //txt.setAttribute("style","dominant-baseline:central; text-anchor:middle;");
    txt.textContent = val;
    return txt;
  }

window.onload = init;


   
function init(){

    //const svg_palette = document.getElementById("palette"); 
    const svg = document.getElementById("mainlayout"); 
    

    svg.addEventListener('mousedown', ActionListener.SVGStartDrag);
    svg.addEventListener('mousemove', ActionListener.SVGDrag);
    svg.addEventListener('mouseup', ActionListener.SVGEndDrag);
    // svg.addEventListener('mouseleave', Renderer.SVGendDrag);


    console.log("Initializing started..."); 

    const g = new GridLayout("mainlayout","v", 60, 70);
    const gXY = g.buildGridXY();
    console.log(gXY);
    for (const key in palette_items) {
            let i = palette_items[key];            
            if ( gXY.hasOwnProperty(key)){
                console.log(key + " - key found")
                if(i.hasOwnProperty('x')) {
                    console.log(i['x']);
                    console.log(gXY[key]['x']);
                    i['x'] = gXY[key]['x'];
                    i['y'] = gXY[key]['y'];
                } else if (i.hasOwnProperty('cx') ){
                    console.log(i['cx']);
                    console.log(gXY[key]['cx']);
                    i['cx'] = gXY[key]['cx'];
                    i['cy'] = gXY[key]['cy'];
                } else if (i.hasOwnProperty('x1') ){
                    console.log(i['x1']);
                    console.log(gXY[key]['x']);
                    i['x1'] = gXY[key]['x'];
                    i['y1'] = gXY[key]['y'];
                    i['x2'] = gXY[key]['x'] + g.itmWidth;
                    i['y2'] = gXY[key]['y'] + g.itmHeight;
                   
                }
                const s = new Shape(i);
                console.log(i);
                const grp_el = new Renderer(s.prep());  
                console.log(grp_el);
                svg.append(grp_el.draw());  
            }
                        
    };             
    console.log("Initializing complete...");   
    
}

///Create SVG element properties for a shape defined in input item object
//Step 1
class Shape {
    constructor(item){
        this.item = item;
    }    
    prep(){
        let d = {};
        for(let k in this.item){
            const v = this.item[k];
            if(k == "s") { k = "stroke"};
            if(k == "sw") { k = "stroke-width"};
            if(k == "f") { k = "fill"};
            d[k] = v;
        }
        // console.log(d);
        return d ;
    }
}

//Step 3
class Renderer {
    constructor(data){
        this.data = data;
    }

    draw(){             
        const e = CE(this.data.type);
        const d = this.data;
        // console.log(d);
        for (let k in d){
            if(k == "type" || k == "name") {continue};
            SA(e,k,d[k]);
        }     
        // SA(e,"onclick", "Renderer.itemSelected(event)")  ;
        SA(e,"id", random());
        SA(e,"class","draggable-selectable draggable");
        const grp = innerDisplay(e, this.data.name , this.data.x + 5, this.data.y + 15 );
        // console.log(grp);
        return grp;
    }

    static itemSelected(evt){

        const el = evt.target; 
        const eid = el.getAttribute("id");        
        const epv = document.getElementById(currentElementSelection);

        if (currentElementSelection == null || currentElementSelection != eid){
            for (let k in selectionStyle){
                SA(el,k,selectionStyle[k]);
            }  
            if ( currentElementSelection != eid && currentElementSelection != null){
                for (let k in selectionStyle){ 
                    RA(epv,k);
                } 
            }  
            currentElementSelection = el.getAttribute("id");
        } 
    }
    static itemDeselect(){
        console.log("Inside itemDeselect : " + currentElementSelection);
        const e = document.getElementById(currentElementSelection);
        if ( currentElementSelection != undefined){
            for (let k in selectionStyle){
                RA(e,k);
            } 
        }         
    }
   



}

//Step 4
class ActionListener{


    static create(){

        const e = document.getElementById(currentElementSelection);
        var svg = document.getElementById("mainlayout"); 
        if (e !== null){
            console.log(e);
            console.log("currentElementSelection :" +currentElementSelection);
            const cnode = e.cloneNode(false);
            //RA(cnode, "class");
            //RA(cnode , "id");
            SA(cnode, "class" , "zindex0 draggable");
            SA(cnode,"id", random());
            SA(cnode,"x", 150);
            SA(cnode,"y", 100);
            console.log(cnode);
            svg.append(cnode);
            return cnode;
        }
        
    }

    static SVGStartDrag(evt){

        if (evt.target.classList.contains('draggable')){
                console.log("Inside SVGStartDrag");  
                Renderer.itemSelected(evt);
                
                const loc = getMousePosition(evt);
                // console.log("Point : " + loc.x + "," + loc.y);
                const svg = document.getElementById("mainlayout");   
                selectedElement = ActionListener.create();
                offset = getMousePosition(evt);
                let tfm = selectedElement.transform.baseVal;
                // console.log("Inside SVGStartDrag length : " + tfm.length + ", offsetx:" + offset.x +", offsety:" + offset.y);

                if (tfm.length === 0 || tfm.getItem(0).type  === SVGTransform.SVG_TRANSFORM_TRANSLATE){

                    var translate = svg.createSVGTransform();
                    translate.setTranslate(0, 0);
                    // Add the translation to the front of the transforms list
                    selectedElement.transform.baseVal.insertItemBefore(translate, 0);
                }

                transform = tfm.getItem(0);
                offset.x -= transform.matrix.e;
                offset.y -= transform.matrix.f;
                console.log("SVGStartDrag :" + transform);

        }

    }

    static SVGDrag(evt){
        console.log("Inside SVGDrag"); 
        console.log("SVGDrag : " + transform); 

        if (currentElementSelection !== undefined){
 
            evt.preventDefault();
            var coord = getMousePosition(evt);
            transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }

    }

    static SVGEndDrag(evt){

        evt.preventDefault();
        var coord = getMousePosition(evt);
        transform.setTranslate(coord.x, coord.y);
        console.log("Inside SVGEndDrag"); 
        currentElementSelection = undefined;
        offset = undefined;
        selectedElement= undefined; 
        transform= undefined;


    }


}

//Step 2
class GridLayout {

    constructor(containerId , axis ,itmWidth, itmHeight ){
        this.axis = axis;
        this.containerId = containerId;
        this.itmWidth = itmWidth + 4;
        this.itmHeight = itmHeight + 4 ;
    }

    // Generate max size of cells based on SVG width and height 
    lotSize(){

        const el = document.getElementById(this.containerId); 
        const w = PALETTE_SIZE.WIDTH;
        const h = PALETTE_SIZE.HEIGHT;
        let s = null;

        if (this.axis == "v"){
            s = Math.ceil( h / this.itmHeight);
        } else if (this.axis == "h") {
            s = Math.ceil( w / this.itmWidth);
        } else if (this.axis == "vh") {
            s = Math.ceil( h / this.itmHeight) * Math.ceil( w / this.itmWidth); 
        }
        return s;
    }


    // Creates an object with  item map and x,y,cx,cy coordinates
    buildGridXY(){

        const el = document.getElementById(this.containerId); 
        const w = PALETTE_SIZE.WIDTH;
        const h = PALETTE_SIZE.HEIGHT;

        let gridXY = {};
        let x, y , cx, cy = undefined;

        for(let i = 0; i < this.lotSize() ; i++){

            if (x == undefined && y == undefined){                
                if (this.axis == "v"){
                    x = Math.ceil( ( w - this.itmWidth) / 2 ) ;
                    y = 20;
                } else if (this.axis == "h") {
                    x = 20;
                    y = Math.ceil( ( h - this.itmHeight) / 2 );
                } 
            }
            else{
                
                
                if (this.axis == "v"){
                    y += this.itmHeight;
                } else if (this.axis == "h") {
                    x += this.itmWidth;                
                } 


            }  
            cx = x + (this.itmWidth/ 2);
            cy = y + (this.itmHeight/ 2);

            let key =  `item${i+1}`;
            gridXY[key] = {x,y, cx , cy };

        };
        return gridXY;

        
    }
}








