let products = [
{ id:1, name:"Laptop", price:50000 },
{ id:2, name:"Mouse", price:500 },
{ id:3, name:"Keyboard", price:1000 }
];

let vendors = [
{ id:1, name:"Dell" },
{ id:2, name:"HP" }
];

window.onload = function(){

let vendorSelect = document.getElementById("vendor");

if(vendorSelect){

vendors.forEach(v=>{
let option=document.createElement("option");
option.value=v.id;
option.text=v.name;
vendorSelect.appendChild(option);
});

}

addRow();

}

function addRow(){

let table = document.querySelector("#productTable tbody");

let row = document.createElement("tr");

row.innerHTML = `
<td>
<select class="product form-control">
${products.map(p=>`<option value="${p.price}">${p.name}</option>`)}
</select>
</td>

<td><input type="number" class="price form-control"></td>

<td><input type="number" class="qty form-control"></td>

<td class="rowTotal">0</td>
`;

table.appendChild(row);

}

document.addEventListener("input",function(){

let rows=document.querySelectorAll("#productTable tbody tr");

let total=0;

rows.forEach(row=>{

let price=row.querySelector(".price").value||0;
let qty=row.querySelector(".qty").value||0;

let rowTotal=price*qty;

row.querySelector(".rowTotal").innerText=rowTotal;

total+=rowTotal;

});

let tax=total*0.05;

document.getElementById("total").innerText=total+tax;

});