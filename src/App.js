import axios from "axios";
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      // buat state untuk menyimpan post ke dalam database json kita
      // inputan sesuai atribut dari json yaitu id, title, body
      dataPost: {
        id: 0,
        namaKaryawan: "",
        jabatan: "",
        jenisKelamin: "",
        date: ""
      },
      editPut: false
    }
    this.handleremove = this.handleremove.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.inputChange = this.inputChange.bind(this);
    // tidak menggunakan bind krna menggunakan ero function
    // this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // FETCH adalah pemanggilan api yang disediakan dari react js 
    // fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then(response => response.json())
    //   .then(json => {
    //     this.setState({
    //       dataApi: json
    //     })
    //   })

    // AXIOS adalah pemanggilan api yang tidak disesdiakan react js, axios external dari luar maka kita harus install terlebih dahulu
    // axios.get('https://jsonplaceholder.typicode.com/posts').then(json => {
    //   console.log(json.data);
    //   this.setState({
    //     dataApi: json.data
    //   })
    // })
    //  Menggunakan server sendiri db.json
    // Panggil function reload data yang berisi axios
    this.reloadData();
  }

  // handleremove(e) {
  //   console.log(e.target.value)
  //   fetch(`https://jsonplaceholder.typicode.com/posts/${e.target.value}`, {
  //     method: "DELETE"
  //   })
  //     .then(json => console.log(json));
  // }

  // Menggunakan server sendiri db.json
  handleremove(e) {
    // console.log(e.target.value)
    fetch(`http://localhost:3004/posts/${e.target.value}`, {
      method: "DELETE"
    })
      .then(json => this.reloadData());
  }
  // Untuk mereload setiap perubahan data
  //  dibikin method untuk function get atau read
  reloadData() {
    axios.get('http://localhost:3004/posts')
      .then(json => {
        // console.log(json.data);
        this.setState({
          dataApi: json.data,
          editPut: false
        })
      })
  }

  // FUNCTION POST untuk menangkap data yang diinput dan dimasukkan ke data state
  inputChange(e) {
    // console.log(e.target.value);
    // menduplikasi atau mencopy kedalam variabel baru menggunakan isx
    let newDataPost = { ...this.state.dataPost };
    // if merupakan logic untuk put    
    if (this.state.edit === false) {
      // untuk membuat ID pakai otomatis getTime
      newDataPost['id'] = new Date().getTime();
    }
    newDataPost[e.target.name] = e.target.value;
    this.setState({
      dataPost: newDataPost
      // MENAMPILKAN hasil dari statenya kedalam console
    }, () => console.log(this.state.dataPost));
  }

  // METHOD UNTUK MENGIRIM DATA INPUT (POST) MENGGUNAKAN AXIOS
  // onSubmit () {
  // axios.post(`http://localhost:3004/posts`,this.state.dataPost)
  // .then(json => this.reloadData)
  // dengan ero function agar tampilan post secara langsung muncul tanpa harus loading
  //   .then(() => {
  //     this.reloadData();
  //   })
  // }
  // Menggunakan ero function di nama fungsi atau method agar tidak harus mendeklrasikan bind diatas
  onSubmit = () => {
    if (this.state.editPut === false) {
      axios.post(`http://localhost:3004/posts`, this.state.dataPost)
        // .then(json => this.reloadData)
        .then(() => {
          this.reloadData();
          this.clearData();

          // AGAR SETELAH BUTTON SUBMIT DICLICK MAKA INPUTAN KOSONG VALUENYA
          let newDataPost = { ...this.state.dataPost };
          newDataPost['id'] = "";
          newDataPost['namaKaryawan'] = "";
          newDataPost['jabatan'] = "";
          newDataPost['jenisKelamin'] = "";
          newDataPost['date'] = "";

          this.setState({
            dataPost: newDataPost
          })
        })
    } else {
      axios.put(`http://localhost:3004/posts/${this.state.dataPost.id}`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        })
    }
  }

  // BUAT FUNCTION UNTUK MENGHAPUS VALUE DARI POST DAN NANTINYA DIGANTI OLEH VALUE EDIT
  clearData = () => {
    // AGAR SETELAH BUTTON SUBMIT DICLICK MAKA INPUTAN KOSONG VALUENYA
    let newDataPost = { ...this.state.dataPost };
    newDataPost['id'] = "";
    newDataPost['namaKaryawan'] = "";
    newDataPost['jabatan'] = "";
    newDataPost['jenisKelamin'] = "";
    newDataPost['date'] = "";

    this.setState({
      dataPost: newDataPost
    })
  }

  getDataID = (e) => {
    axios.get(`http://localhost:3004/posts/${e.target.value}`)
      // .then(json => (console.log(json)))
      // Kita menyimpan data edit ke data post
      .then(json => {
        this.setState({
          dataPost: json.data,
          editPut: true
        })
      })
  }

  render() {
    return (
      <div>
        <p>Post</p>
        <input type="text" value={this.state.dataPost.namaKaryawan} name="namaKaryawan" placeholder="Nama" onChange={this.inputChange} />
        <input type="text" value={this.state.dataPost.jabatan} name="jabatan" placeholder="Jabatan" onChange={this.inputChange} />
        <input type="text" value={this.state.dataPost.jenisKelamin} name="jenisKelamin" placeholder="Jenis Kelamin" onChange={this.inputChange} />
        <input type="date" value={this.state.dataPost.date} name="date" onChange={this.inputChange} />
        <button type="submit" onClick={this.onSubmit}>SAVE</button>
        {this.state.dataApi.map((dat, index) => {
          return (
            <div key={index}>
              <p>Nama : {dat.namaKaryawan}</p>
              <p>Jabatan : {dat.jabatan}</p>
              <p>Jenis Kelamin : {dat.jenisKelamin}</p>
              <p>Tanggal Lahir : {dat.date}</p>
              <button value={dat.id} onClick={this.handleremove}>Delete</button>
              <button value={dat.id} onClick={this.getDataID}>Edit</button>
            </div>
          )
        })}
      </div>
    )
  }
}

export default App;
