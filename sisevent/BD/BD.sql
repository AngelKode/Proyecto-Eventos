-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-08-2020 a las 00:48:54
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
-- Estructura de tabla para la tabla `crearevento`
--

CREATE TABLE `crearevento` (
  `idCreado` int(11) NOT NULL,
  `idAdministrador` int(11) DEFAULT NULL,
  `idUsuarioIn` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `idEvento` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `final` datetime DEFAULT NULL,
  `tipoEv` varchar(100) DEFAULT NULL,
  `categoria` varchar(500) DEFAULT NULL,
  `publico` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`idEvento`, `titulo`, `descripcion`, `inicio`, `final`, `tipoEv`, `categoria`, `publico`) VALUES
(2, 'Programacion Orientada a Objetos', 'Evento de programación', '2020-06-01 12:00:00', '2020-06-05 11:00:00', 'Curso', 'Tecnologica', 'Externo'),
(3, 'Semana mecatrónica', 'Evento mecatronicas', '2020-06-01 08:00:00', '2020-06-19 16:00:00', 'Taller', 'Innovación', 'Interno'),
(4, 'Semana de salud', 'Evento de salud sobre como cuidar tu cuerpo y asi poder tener una vida mas plena', '2020-05-20 10:30:00', '2020-06-24 15:20:00', 'Curso', 'Académico', 'Externo'),
(5, 'Cualtia', 'Evento de alimentos', '2020-06-08 22:58:00', '2020-06-08 22:58:00', 'Capacitacion', 'Académico', 'Interno');

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
(2, 10, 20, 10, 'Nada.', '5ee019452328b-1466774399567_8.jpg', '5ee01945232d5-unnamed.jpg'),
(5, 2, 10, 4, 'Nada', '5ee01756cbbc9-5ee0154ac7f92-444734.jpg-c_300_300_x-f_jpg-q_x-xxyxx.jpg', '5ee01756cce52-imagen2.png');

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
-- Estructura de tabla para la tabla `usuarioex`
--

CREATE TABLE `usuarioex` (
  `idusuarioEx` int(11) NOT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  `contraseña` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarioin`
--

CREATE TABLE `usuarioin` (
  `idusuarioIn` int(11) NOT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  `contraseña` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarioin`
--

INSERT INTO `usuarioin` (`idusuarioIn`, `usuario`, `contraseña`) VALUES
(1, 'upiiz_isc@gmail.com', '123456');

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
-- Indices de la tabla `crearevento`
--
ALTER TABLE `crearevento`
  ADD KEY `idCreado` (`idCreado`),
  ADD KEY `idAdministrador` (`idAdministrador`),
  ADD KEY `idUsuarioIn` (`idUsuarioIn`);

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
-- Indices de la tabla `usuarioex`
--
ALTER TABLE `usuarioex`
  ADD PRIMARY KEY (`idusuarioEx`);

--
-- Indices de la tabla `usuarioin`
--
ALTER TABLE `usuarioin`
  ADD PRIMARY KEY (`idusuarioIn`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `crearevento`
--
ALTER TABLE `crearevento`
  ADD CONSTRAINT `crearevento_ibfk_1` FOREIGN KEY (`idCreado`) REFERENCES `eventos` (`idEvento`),
  ADD CONSTRAINT `crearevento_ibfk_2` FOREIGN KEY (`idAdministrador`) REFERENCES `administrador` (`idadmin`),
  ADD CONSTRAINT `crearevento_ibfk_3` FOREIGN KEY (`idUsuarioIn`) REFERENCES `usuarioin` (`idusuarioIn`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
