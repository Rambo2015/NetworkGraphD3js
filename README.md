# Network Graph menggunakan D3js

## D3js
D3js adalah library javascript digunakan untuk membuat visualisasi data yang **kustom** dan **interaktif** dalam web server dengan menggunakan SVG, HTML, dan CSS.
Website official dari D3js dapat dikunjungi dalam link ini [d3js.org](http://d3js.org). Sementara itu, untuk melihat tutorial dari d3js dapat dilihat dalam website ini [https://www.tutorialspoint.com/d3js/index.htm](https://www.tutorialspoint.com/d3js/index.htm).

## Network Graph
Network diagram (atau Graphs) merupakan diagram yang dapat menunjukkan hubungan antara entitas.
Setiap entitas direpresentasikan dengan sebuah **node** sedangkan koneksi antara kedua node direpresentaskan dengan **link**.

Contoh gambar dari Network Graph (source: https://towardsdatascience.com/a-tale-of-two-convolutions-differing-design-paradigms-for-graph-neural-networks-8dadffa5b4b0): <br><br>
<img src="https://miro.medium.com/max/628/1*KGngJpwr96caSQM9rEbQqw.png"
     alt="Network Graph"
     style="float:right;" />

Pada gambar di atas, setiap titik (warna biru) menggambarkan satu node, garis-garis yang menghubungkan antar node (garis berwarna abu) disebut dengan link.

## Penggunaan
1. Clone repositori ini
2. Buka index.html yang terdapat dalam direktori Network Graph GOT Book1 dengan server (misalkan menggunakan live-server)
3. Network Graph akan muncul di web browser

## Penjelasan Projek
Projek ini bertujuan membuat network diagram dari karakter-karakter yang terdapat dalam Game of Throne Book 1. Data yang digunakan berbentuk `.json` dengan nama file GoTbook1.json. 

```javascript
{ "nodes": [{"name": "Addam-Marbrand", "group": 1}, {"name": "Aegon-I-Targaryen", "group": 1}, {"name": "Aemon-Targaryen-(Maester-Aemon)", "group": 1}, ...... {"name": "Paxter-Redwyne", "group": 1}, {"name": "Ulf-son-of-Umar", "group": 1}],

"links": [{"source": 0, "target": 69, "value": 3, "group": 1}, {"source": 0, "target": 137, "value": 6, "group": 1}, {"source": 1, "target": 32, "value": 5, "group": 1}, {"source": 1, "target": 42, "value": 4, "group": 1}, {"source": 2, "target": 6, "value": 4, "group": 1}, ..... ,{"source": 138, "target": 180, "value": 18, "group": 1}]
}
```
GoTBook1.json berisi dua buah objek yaitu nodes dan links. Dalam nodes berisi list dari objek 

Terdapat 3 file utama dalam direktori yaitu index.html, index.js, dan style.css. Untuk dapat menggunakan d3 js kita dapat memasukkan cdn dari d3 di file html. Dalam proyek ini, d3 yang digunakan adalah d3 versi 3. Script d3 harus didefinisikan terlebih dahulu sebelum index.js agar kita dapat menggunakan fitur-fitur d3 di dalam index.js.

```html
<script src="https://d3js.org/d3.v3.js"></script>
<script src='index.js'></script>
```

### Pendefinisan force layout
Dalam file index.js, dibuat sebuah variabel force yang merupakan set up dari force layout:
```javascript
var width = 800,
    height = 700;

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(100)
    .size([width, height]);
```
force diambil dari d3.layout kemudian beberapa attribute seperti charge, linkDistance, dan size dibuat. linkDistance didefinisikan untuk mengatur jarak antara node yang saling terhubung. Size adalah ukuran dari layout yang diinginkan. Kita telah membuat variabel width dan height sebelumnya yang akan digunakan untuk mendefinisikan attribute size. Sementara itu, charge digunakan untuk mengurangi *rigidity* dari link. Nilai charge yang negatif mengindikasikan *repulsion*.

### Pendefinisian svg
```javascript
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
```
Kita menambahkan variabel svg yang merupakan penambahan svg ke dalam tag body di dalam html. Kita menambahkan juga attribute width dan height untuk svg yang ditambahkan. 

### Membaca File json untuk data node dan link

```javascript
d3.json('GoTbook1.json', function (data) {
    force.nodes(data.nodes)
        .links(data.links)
        .start();
        
// another code below
```

Kita membaca file json menggunakan d3.json. yang memiliki dua parameter yaitu data yang dibaca dan fungsi yang akan dilakukan terhadap data. Dalam hal ini, data yang dibaca adalah `GoTbook1.json`.

Ketika data sudah dibaca, force layout ditambah tiga buah attribute nya yaitu nodes, links, dan start. nodes digunakan untuk membaca seluruh node yang terdapat dalam data agar memiliki efek dari force layout, begitu juga dengan links.

```javascript
// another code above   
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);
// another code below
```

Dibuat juga variabel link dan node, dimana variabel ini masing-masing mendeskripsikan link dan node yang akan ditambahkan pada svg. Pendefinisian variabel link akan menambahkan shape line pada svg sebanyak data link pada file json. Sedangkan variabel node, pertama-tama akan ditambahkan group sebanyak jumlah data node yang terdapat pada file json.

```javascript
// another code above
    node.append("circle")
        .attr("r", 3)
        .style("fill", function (d) {
            return color(d.group);
        })

    node.append("text")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .text(function (d) { return d.name });
// another code below
```
Pada masing-masing group ditambahkan shape circle, dengan attribute radius 3 dan fill sesuai dengan group yang terdapat dalam data node dengan menggunakan scale color yang telah dibuat setelah pendefinisian width dan height. Ditambahkan juga text pada node dimana teks ini akan memunculkan data name dari data json.

```javascript
    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        //Changed

        d3.selectAll("circle").attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });

        d3.selectAll("text").attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
                return d.y;
            });

        //End Changed

    });

}
)
```
Kode diatas bermanfaat untuk membuat node dan link dapat di drag.