-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-08-2020 a las 03:20:53
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
(3, 'Académico', 'Ninguna'),
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
  `modalidad` varchar(20) DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `final` datetime DEFAULT NULL,
  `tipoEv` varchar(100) DEFAULT NULL,
  `categoria` varchar(500) DEFAULT NULL,
  `publico` varchar(50) DEFAULT NULL,
  `origenPonentes` varchar(20) DEFAULT NULL,
  `costoEvento` varchar(30) DEFAULT NULL,
  `cantidadHoras` varchar(10) DEFAULT NULL,
  `MemoriaInstitucional` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`idEvento`, `usuarioCreador`, `titulo`, `descripcion`, `modalidad`, `inicio`, `final`, `tipoEv`, `categoria`, `publico`, `origenPonentes`, `costoEvento`, `cantidadHoras`, `MemoriaInstitucional`) VALUES
(2, 12, 'Programacion Orientada a Objetos', 'Evento de programación', 'Virtual', '2020-06-01 12:00:00', '2020-06-05 11:00:00', 'Curso', 'Tecnologica', 'Externo', 'Externo', '1650', '14', 'Si'),
(3, 12, 'Semana mecatrónica', 'Evento mecatronicas', 'Mixta', '2020-06-01 08:00:00', '2020-06-19 16:00:00', 'Taller', 'Innovación', 'Interno', 'Interno', '5500', '20', 'No'),
(4, 19, 'Semana de salud', 'Evento de salud sobre como cuidar tu cuerpo y asi poder tener una vida mas plena', 'Presencial', '2020-05-20 10:30:00', '2020-06-24 15:20:00', 'Curso', 'Académico', 'Externo', 'No aplica', '2500', '8', 'Si');

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
(2, 10, 20, 10, 'Nada', '5f39d6b6b62a0-4500486-new-york-city-wallpapers.jpg', '5f39d6b6c5576-7039328-brooklyn-bridge-manhattan.jpg');

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
(4, 'Capacitacion', 'Nada');

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
