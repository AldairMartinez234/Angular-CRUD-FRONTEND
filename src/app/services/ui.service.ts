import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class UIService {
  constructor() {}

  showAlertDialog(type:any, title: string, text: any) {
    text = typeof text === "object" ? Object.values(text).join("\n") : text;
    Swal.fire({
      title,
      text,
      icon: type
    });
  }

  showToastAlert(icon: any, title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      // onOpen: toast => {
      //   toast.addEventListener("mouseenter", Swal.stopTimer);
      //   toast.addEventListener("mouseleave", Swal.resumeTimer);
      // }
    });

    Toast.fire({
      icon,
      title
    });
  }

  showAlertConfirm(icon: any, title: string, text: string, handle: () => void) {
    Swal.fire({
      icon,
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
      // confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        handle();
      }
    });
  }

  presentPromt(  title: string, handle:(result: any) => void ){
    Swal.fire({
      title: title,
      html: "<div><textarea class='form-control' id='swalinput'></textarea></div>",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return (document.getElementById("swalinput") as HTMLInputElement).value;
      }
    }).then( (result) => {
      if (!result.dismiss)
        handle(result);
    });
  }

  async presentPromtRadio( title: string, label1: string, label2:string ) : Promise<any> {
    return await Swal.fire({
      title,
      showCancelButton: true,
      html:
        `<div>\
          <label><input type='radio' name='swalradio' id='swal1' checked=''>&nbsp; ${label1}</label> &nbsp; &nbsp;\
          <label><input type='radio' name='swalradio' id='swal2'>&nbsp;${label2}</label>\
        </div>\
        <div>`,
      preConfirm: () => {
        return (<HTMLInputElement>(document.getElementById("swal1"))).checked ? 1 : 0;
      }
    });
  }
}

