'use strict';
/*
 *  Validador de Número de Cédula Nicaraguense
 *
 *Copyright (C) 2008 Denis Torres Guadamuz <denisjtorresg@gmail.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
eslint no-extend-native: ["error", { "exceptions": ["Object"] }]
*/
String.prototype.replaceAll = function (s1, s2) { return this.split(s1).join(s2); }
String.prototype.ltrim = function () { return this.replace(/^s+/, ''); }
String.prototype.rtrim = function () { return this.replace(/s+$/, ''); }
String.prototype.trim = function () { return this.rtrim(this.ltrim(this)); }

/**
* <p>Validador de Número de Cédula Nicaraguense</p>
* <p>Este programa es software libre: usted lo puede redistribuir y/o modificar
* bajo los términos de la GPL version 3</p>
* @autor: denisjtorresg@gmail.com
* @version: 03/03/2008
*/
function ValidarCedula () {
  const this.LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXY';
  let this.cedula = null;

  /**
  * Fijar el Número de Cédula
  *
  * @param cedula Número de Cédula con o sin guiones
  */
  this.setCedula = function (cedula) {
    this.cedula = cedula.trim().replaceAll('-', '');

    if (this.cedula == null || this.cedula.length !== 14) {
      this.cedula = null;
    } else {
      this.cedula = this.cedula.toUpperCase();
    }
  }
  /**
   * Retorna true si la cédula es válida
   * false en caso contrario
   *
   * @return
   */
  this.isCedulaValida = function () {
    if (!this.isPrefijoValido()) { return false; }

    if (!this.isFechaValida()) { return false; }

    if (!this.isSufijoValido()) { return false; }

    if (!this.isLetraValida()) { return false; }

    return true;
  }
  /**
   * Retorna true si el prefijo de la cédula es válida
   * false en caso contrario
   *
   * @return
   */
  this.isPrefijoValido = function () {
    let prefijo = this.getPrefijoCedula();

    if (prefijo == null) { return false; }

    let re = new RegExp('^[0-9]{3}$');
    if (prefijo.search(re) === -1) { return false; }
    return true;
  }
  /**
   * Retorna true si la fecha de la cédula es válida
   * false en caso contrario
   *
   * @return
   */
  this.isFechaValida = function () {
    let fecha = this.getFechaCedula();

    if (fecha == null) { return false; }

    let re = new RegExp('^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])([0-9]{2})$');

    if (fecha.search(re) === -1) { return false; }

    return true;
  }
  /**
   * Retorna true si el sufijo de la cédula es válida
   * false en caso contrario
   *
   * @return
   */
  this.isSufijoValido = function () {
    let sufijo = this.getSufijoCedula();

    if (sufijo == null) { return false; }

    let re = new RegExp('^[0-9]{4}[A-Y]$');

    if (sufijo.search(re) === -1) { return false; }

    return true;
  }
  /**
   * Retorna true si la letra de la cédula es válida
   * false en caso contrario
   *
   * @return
   */
  this.isLetraValida = function () {
    let letraValida = null;
    let letra = this.getLetraCedula();

    if (letra == null) { return false; }

    letraValida = this.calcularLetra();

    return (letraValida === letra);
  }
  /**
   * Retorna un entero que representa la posición en la cadena LETRAS 
   * de la letra final de una cédula
   *
   * @return
   */
  this.getPosicionLetra = function () {
    let posicionLetra = 0;
    let cedulaSinLetra = this.getCedulaSinLetra();
    let numeroSinLetra = 0;

    if (cedulaSinLetra == null) { return -1; }

    numeroSinLetra = cedulaSinLetra;
    posicionLetra = (numeroSinLetra - Math.floor(numeroSinLetra / 23.0) * 23);

    return posicionLetra;
  }
  /**
   * <p>
   * Calcular la letra al final de la cédula nicaraguense.
   * </p><p>
   * Basado en el trabajo de: Arnoldo Suarez Bonilla - arsubo@yahoo.es
   * </p><p>
   * La letra se calcula con el siguiente algoritmo (yo se los envío en SQL).
   * <p>
   * <pre>
   * declare  @cedula      varchar(20),
   *          &#64;val         numeric(13, 0),
   *          &#64;letra       char(1),
   *          &#64;Letras      varchar(20)
   *
   *          select @Letras = 'ABCDEFGHJKLMNPQRSTUVWXY'
   *          select @cedula = '0012510750012' --PARTE NUMERICA DE LA CEDULA SIN GUIONES
   *          --CALCULO DE LA LETRA DE LA CEDULA   
   *          select @val = convert(numeric(13, 0), @cedula) - floor(convert(numeric(13, 0), @cedula) / 23) * 23
   *          select @letra = SUBSTRING(@Letras, @val + 1, 1)
   *          select @letra
   * </pre>
   * @return Letra válida de cédula dada
   */
  this.calcularLetra = function () {
    let posicionLetra = this.getPosicionLetra();

    if (posicionLetra < 0 || posicionLetra >= this.LETRAS.length) { return '?'; }

    return this.LETRAS.charAt(posicionLetra);
  }
  /**
   * Retorna el Número de Cédula
   * @return
   */
  this.getCedula = function () {
    return this.cedula;
  }
  /**
   * Retorna el prefijo de la cédula
   * @return
   */
  this.getPrefijoCedula = function () {
    if (this.cedula != null) {
      return this.cedula.substring(0, 3);
    } else {
      return null;
    }
  }
  /**
   * Retorna la fecha en la cédula
   * @return
   */
  this.getFechaCedula = function () {
    if (this.cedula != null) {
      return this.cedula.substring(3, 9);
    } else {
      return null;
    }
  }
  /**
   * Retorna el sufijo en la cédula
   * @return
   */
  this.getSufijoCedula = function () {
    if (this.cedula != null) {
      return this.cedula.substring(9, 14);
    } else {
      return null;
    }
  }
  /**
   * Retorna la letra de la cédula
   * @return
   */
  this.getLetraCedula = function () {
    if (this.cedula != null) {
      return this.cedula.substring(13, 14);
    } else {
      return null;
    }
  }
  /**
   * Retorna la cédula sin la letra de validación
   * @return
   */
  this.getCedulaSinLetra = function () {
    if (this.cedula != null) {
      return this.cedula.substring(0, 13);
    } else {
      return null; 
    }
  }
}
