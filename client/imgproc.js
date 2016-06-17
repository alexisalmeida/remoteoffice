  function imread(img) {
  
	  var context = canvas.getContext('2d');
	  
	  width = img.width;
	  height = img.height;
	  
	  canvas.width = width;
	  canvas.height = height;
	  
	  context.drawImage(img, 0, 0, width, height);
  
	  var idata = context.getImageData(0, 0, width, height);
	  return idata.data;
 }
  
 function im2double(img, masc) {
	 var s = [];
	 //var me=999, ma=0;
	 
	 for (var i = 0; i < img.length; i++) {
		 //me=Math.min(me,img[i]);
		 //ma=Math.max(ma,img[i]);
		 s[i] = (img[i] & masc) / 255.0;
	 }
	 
	 return s;
 }
 
 function color2Gray(img) {
	 var s = [];
	 var aux;
	 
	 for (var i = 0, p = 0; i < img.length; i+=4) {
		 //aux = (img[i] * 0.2989) + (img[i + 1] * 0.5870) + (img[i + 2] * 0.1140);
		 aux = img[i];
		 s[p++] = Math.ceil(aux);
	 }
	 
	 return s;
 }
 
 
 function calcMae(F1, F2, width, row, col, blockLen, ts) {
     var s = 0;
     var p, pini, aux;
     var mae;
     
     for (var r = 0; r < blockLen; r++) {
    	 pini = (row + r) * width + col;
    	 for (var c = 0; c < blockLen; c++) {
    		 p = pini + c;
    		 aux = Math.abs(F1[p] - F2[p]);
    		 if (aux > ts)
    			 s += (aux);
    	 }
     }
     mae = s / (blockLen * blockLen);
	
     return mae;
 }
 
 mostModified = function (F1, F2, width, height, error, bl) {
    var maiorMae=0;
    var maiorL=0;
    var maiorC=0;
    var ls=999;
    var li=0;
    var ce=999;
    var cd=0;
    var contBlock = 0;
    
    var mae;

    for (var l = 0; l <= (height-bl); l += bl) {
    	
        for (var c = 0; c <= (width-bl); c+=bl) {
            
            mae = calcMae(F1, F2, width, l, c, bl, 0); //0.063
            
            //console.log(l + ", " + c + ": " + mae);
            
            if (mae > maiorMae) {
            	
                maiorMae=mae;
                maiorL=l;
                maiorC=c;
                //BTarget=bloco2;
            }

            if (mae>error) {
            	
                ls=Math.min(ls,l);
                li=Math.max(li,l);
                ce=Math.min(ce,c);
                cd=Math.max(cd,c);
                contBlock++;
            }
        }
    }
    li=li+bl-1;
    cd=cd+bl-1;
	    
    var ret = {
    		"maiorL": maiorL,
    		"maiorC": maiorC,
    		"ls": ls,
    		"li": li,
    		"ce": ce,
    		"cd": cd,
    		"contBlock": contBlock
    }
    
    return ret;
}

function setFrame(a, w, ls, li, ce, cd, cor) {
	for (var i=ls; i < li; i++) {
		a[i * w + ce] = a[i * w + cd] = cor; 
	}
	for (var i=ce; i < cd; i++) {
		a[ls * w + i] = a[li * w + i] = cor; 
	}
	
	return a;
}

function setGrid(a, w, h, bl, cor) {
	for (var i=0; i < h; i+=bl) {
		for (var k=0;k < w; k++) {
			a[i * w + k] = cor;
		}
	}

	for (var i=0; i < w; i+=bl) {
		for (var k=0; k < h; k++) {
			a[i + k * w] = cor;	
		}
		 
	}
	
	return a;
}

function display(a, elem, width, height) {
	 var context = canvas.getContext('2d');
	 var x, y;
	 
	 canvas.width = width;
	 canvas.height = height;
	 
	 var imgData=context.createImageData(width,height);
	 for (var i=0;i<imgData.data.length;i+=4)
	 {
		 aux = a[i/4];
		 imgData.data[i+0]=aux;
		 imgData.data[i+1]=aux;
		 imgData.data[i+2]=aux;
		 imgData.data[i+3]=255;
	 }
	 context.putImageData(imgData,0,0);
	 
	 var data = canvas.toDataURL('image/jpg');
	 
	 elem.attr("src", data);
 }
