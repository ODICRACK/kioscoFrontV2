import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getProductos, getCategorias, crearProducto, editarProducto, eliminarProducto, crearCategoria } from '../services/catalogoService';
import { useSnackbar } from '../context/SnackbarContext';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';
import NuevoProductoModal from '../components/modals/NuevoProductoModal';
import EdicionProductoModal from '../components/modals/EdicionProductoModal';
import ConfigurarStockModal from '../components/modals/ConfigurarStockModal';

const Stock = () => {
    const [, setLocation] = useLocation();
    const { showSnackbar } = useSnackbar();
    // Estados para los Inputs Inline
    const [addingCategory, setAddingCategory] = useState(false);
    const [addingSubCategoryTo, setAddingSubCategoryTo] = useState(null); // Guarda el ID de la categoría
    const [inlineInputValue, setInlineInputValue] = useState('');

    const [showNuevoProducto, setShowNuevoProducto] = useState(false);
    const [showEdicionProducto, setShowEdicionProducto] = useState(false);
    const [showConfigStock, setShowConfigStock] = useState(false);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setIsLoading(true);
        try {
            // Hacemos ambas peticiones al mismo tiempo para que sea más rápido
            const [prodsData, catsData] = await Promise.all([
                getProductos(),
                getCategorias()
            ]);
            setProductos(prodsData);
            setCategorias(catsData);
        } catch (error) {
            showSnackbar('Error al cargar el inventario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCrearProducto = async (nuevoProducto) => {
        try {
            await crearProducto(nuevoProducto);
            showSnackbar('Producto creado con éxito', 'success');
            cargarDatos(); // Recargamos la tabla automáticamente
            // Aquí también deberías cerrar tu modal
        } catch (error) {
            const msj = error.response?.data?.message || 'Error al crear la producto';
            showSnackbar(msj, 'error');
            console.log(error)
        }
    };
    const handleCrearcategoria = async (nombreCate) => {
        try {
            console.log(nombreCate)
            await crearCategoria(nombreCate);
            showSnackbar('categoria creada con éxito', 'success');
            cargarDatos(); // Recargamos la tabla automáticamente
            // Aquí también deberías cerrar tu modal
        } catch (error) {
            const msj = error.response?.data?.message || 'Error al crear categoria';
            showSnackbar(msj, 'error');
            console.log(error)
        }
    };

    const handleEditarProducto = async (id, datosActualizados) => {
        try {
            await editarProducto(id, datosActualizados);
            showSnackbar('Producto actualizado correctamente', 'success');
            cargarDatos();
        } catch (error) {
            showSnackbar('Error al actualizar el producto', 'error');
        }
    };
    // 4. Función para conectar a tu botón de "Eliminar" (Soft Delete)
    const handleEliminarProducto = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

        try {
            await eliminarProducto(id);
            showSnackbar('Producto eliminado del sistema', 'success');
            cargarDatos();
        } catch (error) {
            showSnackbar('Error al eliminar el producto', 'error');
        }
    };

    // Función para forzar solo números y simular el auto-guardado
    const handleNumberChange = (e, field, id) => {
        const value = e.target.value.replace(/\D/g, ''); // Remueve cualquier caracter no numérico
        // TODO: Aquí se despacharía la acción a Axios/Context para actualizar el estado global en tiempo real
        console.log(`Auto-guardando ${field} del producto ${id}: ${value}`);
    };

    // Renderizador del formulario Inline
    const renderInlineForm = (onCancel, onAccept, placeholder) => (
        <div className="inline-form">
            <Input
                value={inlineInputValue}
                onChange={(e) => setInlineInputValue(e.target.value)}
                placeholder={placeholder}
            />
            <button className="btn-inline btn-inline--accept"  onClick={() => onAccept(inlineInputValue)}>
                <span className="material-icons">check</span>
            </button>
            <button className="btn-inline btn-inline--cancel" onClick={() => {
                setInlineInputValue('');
                onCancel();
            }}>
                <span className="material-icons">close</span>
            </button>
        </div>
    );

    return (
        <div className="stock">
            {/* Cabecera Especial de Stock */}
            <div className="header">
                <BackButton onClick={() => setLocation('/')} />

                <div className="stock__header-actions">
                    {/* Botón de Configurar Stock (Q3) */}
                    <button className="btn-edit" onClick={() => setShowConfigStock(true)}>
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                    </button>

                    {/* Botón de Nuevo Producto en la esquina superior derecha (Q1) */}
                    <button
                        className="shift-btn shift-btn--active"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}
                        onClick={() => setShowNuevoProducto(true)}
                    >
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <h1 className="stock__main-title">Categorías</h1>

            {/* --- RENDERIZADO DINÁMICO DE CATEGORÍAS --- */}
            {categorias.map((categoria) => (
                <div key={categoria.id} className="stock__category">
                    <h2 className="stock__category-title">{categoria.nombre}</h2>

                    <div className="stock__grid-header">
                        <span>Nombre</span>
                        <span>Stock</span>
                        <span>Precio</span>
                        <span>Editar</span>
                    </div>

                    {/* PRODUCTOS SIN SUBCATEGORÍA (Directos a la categoría, si los hubiera) */}
                    {productos
                        .filter(p => p.categoria_nombre === categoria.nombre && !p.id_subcategoria)
                        .map(producto => (
                            <div key={producto.id} className="stock__row">
                                <span className="stock__name">{producto.nombre}</span>
                                <Input
                                    className="input--stock"
                                    defaultValue={producto.stock}
                                    onBlur={(e) => handleNumberChange(e, 'stock', producto.id)}
                                />
                                <div className="stock__price-wrapper">
                                    <span>$</span>
                                    <Input
                                        className="input--stock"
                                        defaultValue={producto.precio}
                                        onBlur={(e) => handleNumberChange(e, 'precio', producto.id)}
                                    />
                                </div>
                                <button className="btn-edit" onClick={() => {
                                    // Asume que tienes un estado setProductoActivo(producto) para pasarle datos al modal
                                    setShowEdicionProducto(true);
                                }}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                            </div>
                        ))}

                    {/* SUBCATEGORÍAS ANIDADAS Y SUS PRODUCTOS */}
                    {categoria.subcategorias && categoria.subcategorias.map(subcat => (
                        <div key={subcat.id}>
                            <h3 className="stock__subcategory-title">{subcat.nombre}</h3>
                            
                            {productos
                                .filter(p => p.id_subcategoria === subcat.id)
                                .map(producto => (
                                    <div key={producto.id} className="stock__row">
                                        <span className="stock__name">{producto.nombre}</span>
                                        <Input
                                            className="input--stock"
                                            defaultValue={producto.stock}
                                            onBlur={(e) => handleNumberChange(e, 'stock', producto.id)}
                                        />
                                        <div className="stock__price-wrapper">
                                            <span>$</span>
                                            <Input
                                                className="input--stock"
                                                defaultValue={producto.precio}
                                                onBlur={(e) => handleNumberChange(e, 'precio', producto.id)}
                                            />
                                        </div>
                                        <button className="btn-edit" onClick={() => setShowEdicionProducto(true)}>
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </div>
                                ))}
                        </div>
                    ))}

                    {/* BOTÓN NUEVA SUBCATEGORÍA (Específico para esta categoría) */}
                    {addingSubCategoryTo === categoria.id ? (
                        renderInlineForm(
                            () => setAddingSubCategoryTo(null), 
                            (nombre) => console.log('Llamar a crearSubCategoria con:', categoria.id, nombre), 
                            'Nombre subcategoría...'
                        )
                    ) : (
                        <Button onClick={() => setAddingSubCategoryTo(categoria.id)}>
                            Nueva SubCategoria
                        </Button>
                    )}
                </div>
            ))}

            {/* --- BOTÓN GLOBAL NUEVA CATEGORÍA --- */}
            <div style={{ marginTop: '2rem' }}>
                {addingCategory ? (
                    renderInlineForm(
                        () => setAddingCategory(false), 
                        (nombre) => handleCrearcategoria(nombre)
                    )
                ) : (
                    <Button onClick={() => setAddingCategory(true)}>Nueva Categoría</Button>
                )}
            </div>

            {/* MODALES */}
            <NuevoProductoModal
                isOpen={showNuevoProducto}
                onClose={() => setShowNuevoProducto(false)}
                categorias={categorias} // Sugerencia: pasar las categorías al modal para el select
            />

            <EdicionProductoModal
                isOpen={showEdicionProducto}
                onClose={() => setShowEdicionProducto(false)}
            />

            <ConfigurarStockModal
                isOpen={showConfigStock}
                onClose={() => setShowConfigStock(false)}
            />
        </div>
    );
};

export default Stock;