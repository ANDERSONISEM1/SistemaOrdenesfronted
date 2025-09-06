import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Item {
  id: number;
  nombre: string;
  precioUnitario: number;
  existencia: number;
}

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit {
  private apiUrl = 'http://localhost:5158/api';

  constructor(private http: HttpClient) {}

  // Datos cliente
  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  direccion = '';
  telefono = '';
  correo = '';
  nit = 'C/F';

  // Productos
  items: Item[] = [];
  seleccion: Item | null = null;
  cantidad: number | null = null;

  // Resumen de orden
  resumen: { nombre: string; cantidad: number; precio: number; subtotal: number }[] = [];
  total = 0;

  // Filtro buscador
  filtroProducto = '';
  sugerencias: Item[] = [];
  busquedaRealizada = false;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<Item[]>(`${this.apiUrl}/productos`).subscribe(data => {
      this.items = data;
    });
  }

  buscarProductos() {
    const q = this.filtroProducto.trim();
    if (!q) {
      this.sugerencias = [];
      this.busquedaRealizada = false;
      return;
    }

    this.http
      .get<Item[]>(`${this.apiUrl}/productos?nombre=${encodeURIComponent(q)}`)
      .subscribe({
        next: (data) => {
          console.log("🔍 Respuesta API:", data); // debug
          this.sugerencias = data;
          this.busquedaRealizada = true;
        },
        error: (err) => {
          console.error('❌ Error buscando productos:', err);
          this.sugerencias = [];
          this.busquedaRealizada = true;
        }
      });
  }

  seleccionarProducto(item: Item) {
    this.seleccion = item;
    this.filtroProducto = item.nombre;
    this.cantidad = 1;
    this.sugerencias = [];
    this.busquedaRealizada = false;
  }

  agregarProducto() {
    if (!this.seleccion || !this.cantidad) return;

    const subtotal = this.seleccion.precioUnitario * this.cantidad;
    this.total += subtotal;

    this.resumen.push({
      nombre: this.seleccion.nombre,
      cantidad: this.cantidad,
      precio: this.seleccion.precioUnitario,
      subtotal
    });

    this.seleccion = null;
    this.cantidad = null;
    this.filtroProducto = '';
    this.busquedaRealizada = false;
  }

  confirmarOrden() {
    if (!this.primerNombre.trim() || !this.primerApellido.trim() || !this.direccion.trim() || this.resumen.length === 0) {
      alert('⚠️ Complete los campos del cliente y agregue al menos un producto antes de confirmar la orden.');
      return;
    }

    const orden = {
      numeroOrden: Date.now().toString(),
      cliente: {
        primerNombre: this.primerNombre,
        segundoNombre: this.segundoNombre,
        primerApellido: this.primerApellido,
        segundoApellido: this.segundoApellido,
        direccion: this.direccion,
        telefono: this.telefono,
        correo: this.correo,
        nit: this.nit
      },
      fecha: new Date().toISOString(),
      total: this.total,
      estado: 'Pendiente',
      detalles: this.resumen.map(r => ({
        productoId: this.items.find(i => i.nombre === r.nombre)?.id,
        cantidad: r.cantidad,
        precioUnitario: r.precio
      }))
    };

    this.http.post(`${this.apiUrl}/ordenes`, orden).subscribe(() => {
      alert('✅ Orden guardada en BD');
      this.limpiarOrden();
    });
  }

  limpiarOrden() {
    this.primerNombre = '';
    this.segundoNombre = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.direccion = '';
    this.telefono = '';
    this.correo = '';
    this.nit = 'C/F';
    this.seleccion = null;
    this.cantidad = null;
    this.filtroProducto = '';
    this.sugerencias = [];
    this.resumen = [];
    this.total = 0;
    this.busquedaRealizada = false;
  }

  focoNit() {
    if (this.nit === 'C/F') this.nit = '';
  }

  blurNit() {
    if (this.nit.trim() === '') this.nit = 'C/F';
  }

  verOrdenes() {
    this.http.get<any[]>(`${this.apiUrl}/ordenes`).subscribe(data => {
      alert(`Se encontraron ${data.length} órdenes en la BD 📋`);
    });
  }
}
