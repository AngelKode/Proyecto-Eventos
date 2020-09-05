-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2020 a las 22:25:23
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tecweb2020`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `idadmin` int(11) NOT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  `contraseña` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`idadmin`, `usuario`, `contraseña`) VALUES
(1, 'upiiz_isc@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(10) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Observaciones` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `Nombre`, `Observaciones`) VALUES
(1, 'Deportiva', 'Ninguna'),
(2, 'Tecnologica', 'Ninguna'),
(3, 'Académico', 'Nada'),
(4, 'Innovación', 'Ninguna');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `idEvento` int(11) NOT NULL,
  `usuarioCreador` int(255) DEFAULT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `NoRegistro` varchar(100) NOT NULL DEFAULT 'Nada',
  `Rama` varchar(100) DEFAULT NULL,
  `modalidad` varchar(20) DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `final` datetime DEFAULT NULL,
  `tipoEv` int(255) DEFAULT NULL,
  `categoria` int(255) DEFAULT NULL,
  `publico` varchar(50) DEFAULT NULL,
  `origenPonentes` varchar(20) DEFAULT NULL,
  `costoEvento` varchar(30) DEFAULT NULL,
  `FormaDePago` varchar(100) DEFAULT NULL,
  `cantidadHoras` varchar(10) DEFAULT NULL,
  `MemoriaInstitucional` varchar(5) DEFAULT NULL,
  `datosCapturados` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`idEvento`, `usuarioCreador`, `titulo`, `descripcion`, `NoRegistro`, `Rama`, `modalidad`, `inicio`, `final`, `tipoEv`, `categoria`, `publico`, `origenPonentes`, `costoEvento`, `FormaDePago`, `cantidadHoras`, `MemoriaInstitucional`, `datosCapturados`) VALUES
(2, 12, 'Programacion Orientada a Objetos', 'Nada', '', 'Ingeniería y Ciencias Físico Matemáticas', 'Mixta', '2020-07-05 12:00:00', '2020-10-07 11:00:00', 1, 4, 'Gobierno', 'IPN', '10', 'Oferta Libre de Cuota', '14', 'Si', 1),
(3, 12, 'Semana mecatrónica', 'Evento mecatronicas', '1728421', 'Ciencias Sociales y Administrativas', 'Mixta', '2020-06-01 08:00:00', '2020-06-19 16:00:00', 1, 3, 'Público General', 'Institución Privada', '5500', 'Convenio', '20', 'No', 0),
(4, 19, 'Semana de salud', 'Evento de salud sobre como cuidar tu cuerpo y asi poder tener una vida mas plena', '', 'Ingeniería y Ciencias Físico Matemáticas', 'Presencial', '2020-05-20 10:30:00', '2020-06-02 15:20:00', 5, 2, 'Comunidad IPN', 'Institución Pública', '2500', 'Convenio', '8', 'Si', 0),
(5, 1, 'Ejemplo primer Trimestre 2019', 'Nada', '', 'Ciencias Sociales y Administrativas', 'Presencial', '2019-02-05 00:47:00', '2019-02-08 00:47:00', 1, 1, 'Gobierno', 'IPN', '20', 'Oferta Libre de Cuota', '17', 'Si', 1),
(6, 1, 'Primer trimestre', 'nada', '', 'Ciencias Sociales y Administrativas', 'Presencial', '2019-03-04 00:47:00', '2019-03-08 00:47:00', 1, 1, 'Gobierno', 'IPN', '1', 'Oferta Libre de Cuota', '17', 'Si', 0),
(7, 1, 'Ejemplo primer trimestre 2020', 'Nada', '2', 'Ciencias Sociales y Administrativas', 'Presencial', '2020-02-05 13:16:00', '2020-02-07 13:16:00', 1, 1, 'Gobierno', 'IPN', '120', 'Oferta Libre de Cuota', '25', 'Si', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evidencias`
--

CREATE TABLE `evidencias` (
  `id` int(6) NOT NULL,
  `numHombres` int(6) DEFAULT NULL,
  `numMujeres` int(6) DEFAULT NULL,
  `numExpositores` int(6) DEFAULT NULL,
  `pormenores` varchar(2000) NOT NULL,
  `evidencia1` varchar(500) NOT NULL,
  `evidencia2` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `evidencias`
--

INSERT INTO `evidencias` (`id`, `numHombres`, `numMujeres`, `numExpositores`, `pormenores`, `evidencia1`, `evidencia2`) VALUES
(2, 10, 20, 10, 'Nada acerca de este evento.\nFue un evento realmente bueno porque pudimos tener la oportunidad de conocer mas acerca de esta interesante área de conocimiento.', '5f4d62bc3dec2-101219.jpg', '5f4d62bc441ff-Images of Landscapes of colorful spring _22 Wallpaper Full HD.jpg'),
(3, 10, 10, 10, 'Fue un evento importante.\nTuvimos demasiadas cosas interesantes que pudimos observar y tener la oportunidad de estar frente a frente a ese tipo de tecnología.\nQue sigan asi!.', '', ''),
(4, 10, 5, 10, 'Ninguno', '5f50410d43438-101219.jpg', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_evento`
--

CREATE TABLE `tipo_evento` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Observaciones` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_evento`
--

INSERT INTO `tipo_evento` (`ID`, `Nombre`, `Observaciones`) VALUES
(1, 'Simposium', 'Nada'),
(2, 'Taller', 'Nada'),
(3, 'Curso', 'Nada'),
(4, 'Capacitacion', 'Nada'),
(5, 'Bootcamp', 'Nada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarioeditor`
--

CREATE TABLE `usuarioeditor` (
  `id` int(100) NOT NULL,
  `Nombre_Editor` varchar(250) NOT NULL,
  `Correo_Editor` varchar(250) NOT NULL,
  `Celular_Editor` varchar(30) NOT NULL,
  `Nombre_Usuario` varchar(250) NOT NULL,
  `Contraseña_Usuario` varchar(250) NOT NULL,
  `Editor_MemInstitucional` varchar(10) NOT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarioeditor`
--

INSERT INTO `usuarioeditor` (`id`, `Nombre_Editor`, `Correo_Editor`, `Celular_Editor`, `Nombre_Usuario`, `Contraseña_Usuario`, `Editor_MemInstitucional`, `estado`) VALUES
(12, 'Pedro', 'pedro@live.com', '(451) 513-5313', 'Pedro01', '1234', 'Si', 'Activo'),
(19, 'Angel', 'angel@live.com', '(492) 218-9243', 'Assesin', '1234', 'Si', 'Activo'),
(23, 'Ejemplo', 'ejemplo@live.com', '(125) 125-1859', 'Pedrito', '1234', 'Si', 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`idadmin`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`idEvento`);

--
-- Indices de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_evento`
--
ALTER TABLE `tipo_evento`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuarioeditor`
--
ALTER TABLE `usuarioeditor`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarioeditor`
--
ALTER TABLE `usuarioeditor`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
