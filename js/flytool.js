//tool palette shapes declare
const json_palette =    `{  
                            "item1" : { "type": "rect" , "width": 60, "height": 40, "x": 20, "y": 70 ,"rx":"30","ry":30, "s" : 0 , "f": "rgb(84,141,68)" , "sw" : 0 , "name": "Start" },
                            "item2" : { "type": "rect" , "width": 60, "height": 40, "x": 20, "y": 140 , "s" : 0 , "f": "rgb(102,119,204)" , "sw" : 0 , "name": "Step" },    
                            "item3" : { "type": "circle" , "cx": 50, "cy": 240, "r": 30 , "s" : 0 , "f": "rgb(183,6,6)" , "sw" : 0 , "name" : "End"} ,
                            "item4" : { "type": "line" , "x1": 20, "y1": 40 , "x2": 80 , "y2": 40, "style":"stroke:yellow;stroke-width:2" , "name": "" } 
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
//const selectionStyle = {"stroke":"yellow","stroke-width":"5","stroke-opacity":"0.4"};
var selectedElement, offset, gtfm = undefined;

const PALETTE_SIZE = {"WIDTH": 100 , "HEIGHT" : 600};


window.onload = init;
    
function init(){

    //const svg_palette = document.getElementById("palette"); 
    const svg = document.getElementById("mainlayout");     

    svg.addEventListener('mousedown', SVGStartDrag);
    svg.addEventListener('mousemove', SVGDrag);
    svg.addEventListener('mouseup', SVGEndDrag);
    svg.addEventListener('dblclick', addtext);  
    // svg.addEventListener('mouseleave', Renderer.SVGendDrag);


    console.log("Initializing started..."); 
    
    var g = new GridLayout("mainlayout","v", 60, 70);
    var gXY = g.buildGridXY();

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
                const grp_el = new Renderer(key, s.prep());  
                console.log(grp_el);
                svg.append(grp_el.draw());  
            }
                        
    };             
    console.log("Initializing complete...");   
    
}

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
    const svg = document.getElementById("mainlayout");   
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
    txt.setAttribute("font-size", 20);
    txt.setAttribute("alignment-baseline", "middle" );
    txt.setAttribute("transform", "translate(5,5)" );
    txt.setAttribute("class", "draggable palette zi0" );
    //txt.setAttribute("style","dominant-baseline:central; text-anchor:middle;");
    txt.textContent = val;
    return txt;
  }

//Inside setDraggable
function addtext(evt){

    var e = evt.target;
    var p = document.getElementById("mainlayout");
    let w,h,x,y,cx,cy = undefined;

    if (e instanceof SVGRectElement || e instanceof SVGCircleElement){
      console.log(" Inside dblclick" + e);
    
      if (e instanceof SVGRectElement ) {
        w = parseFloat(evt.target.getAttribute("width"));
        h = parseFloat(evt.target.getAttribute("height"));
        x = parseFloat(evt.target.getAttribute("x"));
        y = parseFloat(evt.target.getAttribute("y"));
      } else if (e instanceof SVGCircleElement ) {
        cx = parseFloat(evt.target.getAttribute("cx"));
        cy = parseFloat(evt.target.getAttribute("cy"));
      }

      const frgn = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');      
      frgn.setAttribute("x", x);
      frgn.setAttribute("y", y);
      frgn.setAttribute("width", w);
      frgn.setAttribute("height", h);
      //frgn.setAttribute("transform", "translate(5,5)" );
      p.append(frgn);
      
      const ta = document.createElement("textarea");  
      ta.setAttribute("style", "color: white ;"); 
      //ta.setAttribute("transform", "translate(2,2)" );
      ta.addEventListener("focusout", (event) => {    
        
            const ta_value = ta.value;
            frgn.remove();
            const grp = document.createElementNS('http://www.w3.org/2000/svg','g');  
            //grp.setAttribute("transform", "translate(2,2)" );    
            grp.append(e);
            const t = textadd(ta_value, x +10 , y +50  , "purple");
            grp.append(t);
            p.append(grp);



      });
      // ta.setAttribute("cols", 2);    
      frgn.append(ta);

      console.log(frgn);

    }

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
    constructor(item_name ,data){
        this.item_name = item_name;
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
        SA(e,"onclick", "Renderer.itemSelected(event)")  ;
        SA(e,"id", `${this.item_name}-${random()}`);
        SA(e,"class","draggable palette");
        if (d.hasOwnProperty("x")){
            const grp = innerDisplay(e, this.data.name , this.data.x + 5, this.data.y + 15 );
            return grp;
        } else if (d.hasOwnProperty("cx")) {
            const grp = innerDisplay(e, this.data.name , this.data.cx - 20, this.data.cy  );
            return grp;
        }  else if (d.hasOwnProperty("x1")) {
            const grp = innerDisplay(e, this.data.name , this.data.x1 , this.data.y2  );
            return grp;
        }  
        console.log(grp);
        
    }

    static itemSelected(evt){
        
        const el = evt.target; 
        const eid = GA(el,"id") ;
        console.log("Inside itemSelected : " + currentElementSelection);
        if (currentElementSelection == null || currentElementSelection != eid){
            if (el.classList.contains('palette')){
                SA(el,"class", "draggable-selected draggable palette"); 
            } else {
                SA(el,"class", "draggable-selected draggable"); 
            }
            
            currentElementSelection = eid ; 
        } 
        Renderer.itemDeselect(false);
    }

    static itemDeselect(a){

        //Click on svg layout
        if (a == true){
            currentElementSelection = undefined;
        }

        //When a item is selected
        const nodes = document.querySelectorAll(".draggable-selected");
        for ( let i = 0 ; i< nodes.length ; i++){
            const e = nodes[i];
            const id = GA(e, "id");
            if ( id !==  currentElementSelection ){
                if (e.classList.contains('palette') ) {
                    SA(e, "class", "draggable palette");
                } else {
                    SA(e, "class", "draggable");
                }
                
            }           
        }
        
    }
}



function create(){

    const e = document.getElementById(currentElementSelection);
    var svg = document.getElementById("mainlayout"); 
    if (e !== null){
        console.log("create() : currentElementSelection :" +currentElementSelection);
        const cnode = e.cloneNode(true);
        SA(cnode, "class" , "draggable-selected draggable");
        SA(cnode,"id", random());
        console.log(cnode);
        svg.append(cnode);
        currentElementSelection = GA(cnode,"id");
        return cnode;
    }
    
}
    

function SVGStartDrag(evt){

    let e = evt.target;
    const id = GA(e,"id");

    console.log("Inside SVGStartDrag : id :" + id);

    //Only for svg layout clicks
    if( id === "mainlayout") {
        Renderer.itemDeselect(true);
    }

    //Create a new item when a palette item is selected for drag else drag item along the main layout.
    if (e.classList.contains('palette')){
        selectedElement = create(); 
        
    } else {
        selectedElement  = e ;
    }
                        

    //Only on Item clicks
    if (e.classList.contains('draggable')){
            console.log("Inside If of SVGStartDrag ");  
            console.log(evt.target);
            console.log("e.classList.contains('palette')" + e.classList.contains('palette'))
            
            const loc = getMousePosition(evt);
            // console.log("Point : " + loc.x + "," + loc.y);
            const svg = document.getElementById("mainlayout");              

            offset = getMousePosition(evt);
            console.log("1.loc.x : " + loc.x + ",loc.y : " + loc.y);
            console.log("1.offset.x : " + offset.x + ",offset.y : " + offset.y);

            let tfm = selectedElement.transform.baseVal;
            // console.log("Inside SVGStartDrag length : " + tfm.length + ", offsetx:" + offset.x +", offsety:" + offset.y);

            if (tfm.length === 0 || tfm.getItem(0).type  === SVGTransform.SVG_TRANSFORM_TRANSLATE){

                var translate = svg.createSVGTransform();
                translate.setTranslate(0, 0);
                // Add the translation to the front of the transforms list
                //selectedElement.transform.baseVal.insertItemBefore(translate, 0);
                tfm.insertItemBefore(translate, 0);
            }

            gtfm = tfm.getItem(0);
            console.log("gtfm.matrix.e : " + gtfm.matrix.e + ", gtfm.matrix.f : " + gtfm.matrix.f);
            offset.x -= gtfm.matrix.e;
            offset.y -= gtfm.matrix.f;
            console.log("SVGStartDrag :" + gtfm);

    }

}

function SVGDrag(evt){

    if (evt.target.classList.contains('draggable') && offset !== undefined){
    console.log("Inside SVGDrag"); 
    //console.log("SVGDrag : " + transform); 
    const coord = getMousePosition(evt);
    console.log("2.coord.x : " + coord.x + ",coord.y : " + coord.y);
    console.log("2.offset.x : " + offset.x + ",offset.y : " + offset.y);
    console.log("2.gtfm.matrix.e : " + gtfm.matrix.e + ", 2.gtfm.matrix.f : " + gtfm.matrix.f);
        if (currentElementSelection !== undefined){
            evt.preventDefault();            
            gtfm.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
    }

}

function SVGEndDrag(evt){

    if (offset !== undefined) {
        evt.preventDefault();
        const coord = getMousePosition(evt);
        console.log("3.coord.x : " + coord.x + ",coord.y : " + coord.y);
        console.log("3.offset.x : " + offset.x + ",offset.y : " + offset.y);
        console.log("3.gtfm.matrix.e : " + gtfm.matrix.e + ", 3.gtfm.matrix.f : " + gtfm.matrix.f);
        gtfm.setTranslate(coord.x - offset.x, coord.y - offset.y);
        console.log("Inside SVGEndDrag");     
        offset = undefined;
        selectedElement= undefined; 
        gtfm= undefined;
        currentElementSelection = undefined;
        console.log(evt.target.transform.baseVal);

    }

    Renderer.itemDeselect(false);


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









