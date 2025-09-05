import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Item {
  id: number;
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent {
  // Datos cliente
  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  direccion = '';
  telefono = '';
  correo = '';
  nit = 'C/F';

  // Productos y orden
  items: Item[] = [
    { id: 1, nombre: 'Laptop', precio: 800 },
    { id: 2, nombre: 'Mouse', precio: 150 },
    { id: 3, nombre: 'Teclado', precio: 250 },
    { id: 4, nombre: 'Monitor', precio: 1200 }
  ];

  // Selección de producto
  seleccion: Item | null = null;
  cantidad: number | null = null;

  // Resumen de la orden
  resumen: { nombre: string; cantidad: number; precio: number; subtotal: number }[] = [];
  total: number = 0;

  // Filtro de búsqueda
  filtroProducto = '';

  // Devuelve productos filtrados en tiempo real
  get productosFiltrados(): Item[] {
    if (!this.filtroProducto) return this.items;
    return this.items.filter(item =>
      item.nombre.toLowerCase().includes(this.filtroProducto.toLowerCase())
    );
  }

  // Seleccionar producto desde la lista filtrada
  seleccionarProducto(item: Item) {
    this.seleccion = item;
    this.filtroProducto = item.nombre;
    this.cantidad = 1;
  }

  // Lista desplegable
  cambiarPrecio(itemId: number) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      this.seleccion = item;
      this.filtroProducto = item.nombre;
      this.cantidad = 1;
    }
  }

  // Agregar producto al resumen
  agregarProducto() {
    if (!this.seleccion || !this.cantidad) return;

    const subtotal = this.seleccion.precio * this.cantidad;
    this.total += subtotal;
    this.resumen.push({
      nombre: this.seleccion.nombre,
      cantidad: this.cantidad,
      precio: this.seleccion.precio,
      subtotal
    });

    // Limpiar selección para el siguiente producto
    this.seleccion = null;
    this.cantidad = null;
    this.filtroProducto = '';
  }

  // Confirmar orden
  confirmarOrden() {
    alert('Orden confirmada ✅');
    this.limpiarOrden();
  }

  // Limpiar toda la orden
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

    this.resumen = [];
    this.total = 0;
  }

  focoNit() {
    if (this.nit === 'C/F') this.nit = '';
  }

  blurNit() {
    if (this.nit.trim() === '') this.nit = 'C/F';
  }

  verOrdenes() {
    alert('Aquí se mostrarían las órdenes guardadas 📋');
  }
}
