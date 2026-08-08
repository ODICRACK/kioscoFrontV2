import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getProductos, getCategorias, crearProducto, editarProducto, eliminarProducto, crearCategoria, crearSubCategoria, eliminarCategoria, eliminarSubCategoria } from '../services/catalogoService';
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

    const [productoActivo, setProductoActivo] = useState(null);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [prodsData, catsData] = await Promise.all([
                getProductos(),
                getCategorias()
            ]);
            setProductos(prodsData);
            setCategorias(catsData);
        } catch (error) {
            showSnackbar('Error al cargar el inventario', 'error');
        }
    };

    const handleCrearProducto = async (nuevoProducto) => {
        try {
            await crearProducto(nuevoProducto);
            showSnackbar('Producto creado con éxito', 'success');
            cargarDatos();
            setShowNuevoProducto(false);
        } catch (error) {
            const msj = error.response?.data?.message || 'Error al crear el producto';
            showSnackbar(msj, 'error');
        }
    };

    const handleCrearcategoria = async (nombreCate) => {
        try {
            await crearCategoria(nombreCate);
            showSnackbar('Categoría creada con éxito', 'success');
            setAddingCategory(false);
            setInlineInputValue('');
            cargarDatos();
        } catch (error) {
            const msj = error.response?.data?.message || 'Error al crear categoría';
            showSnackbar(msj, 'error');
        }
    };

    const handleCrearSubcategoria = async (idCategoria, nombreSub) => {
        try {
            await crearSubCategoria(idCategoria, nombreSub);
            showSnackbar('Subcategoría creada con éxito', 'success');
            setAddingSubCategoryTo(null);
            setInlineInputValue('');
            cargarDatos();
        } catch (error) {
            const msj = error.response?.data?.message || 'Error al crear subcategoría';
            showSnackbar(msj, 'error');
        }
    };

    const handleEliminarCategoria = async (id) => {
        try {
            await eliminarCategoria(id);
            showSnackbar('Categoría eliminada con éxito', 'success');
            cargarDatos();
        } catch (error) {
            showSnackbar('Error al eliminar la categoría', 'error');
        }
    };

    const handleEliminarSubcategoria = async (id) => {
        try {
            await eliminarSubCategoria(id);
            showSnackbar('Subcategoría eliminada con éxito', 'success');
            cargarDatos();
        } catch (error) {
            showSnackbar('Error al eliminar la subcategoría', 'error');
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

    const handleNumberChange = async (e, field, id) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value === '') return;
        try {
            await editarProducto(id, { [field]: Number(value) });
            showSnackbar(`${field === 'stock' ? 'Stock' : 'Precio'} actualizado`, 'success');
            setProductos(prev => prev.map(p => p.id === id ? { ...p, [field]: Number(value) } : p));
        } catch (error) {
            showSnackbar(`Error al actualizar ${field}`, 'error');
        }
    };

    const renderInlineForm = (onCancel, onAccept, placeholder) => (
        <div className="inline-form">
            <Input
                value={inlineInputValue}
                onChange={(e) => setInlineInputValue(e.target.value)}
                placeholder={placeholder}
            />
            <button className="btn-inline btn-inline--accept" onClick={() => onAccept(inlineInputValue)}>
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

    // Filtrar únicamente las subcategorías que pertenecen a la categoría del producto siendo editado
    const catDelProducto = (categorias || []).find(
        c => c.nombre === productoActivo?.categoria_nombre
    );
    const subcategoriasDelProducto = catDelProducto?.subcategorias || [];

    return (
        <div className="stock">
            {/* Cabecera Especial de Stock */}
            <div className="header">
                <BackButton onClick={() => setLocation('/')} />

                <div className="stock__header-actions">
                    <button className="btn-edit" onClick={() => setShowConfigStock(true)}>
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                    </button>

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

                    {/* PRODUCTOS SIN SUBCATEGORÍA */}
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
                                    setProductoActivo(producto);
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
                                        <button className="btn-edit" onClick={() => {
                                            setProductoActivo(producto);
                                            setShowEdicionProducto(true);
                                        }}>
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </div>
                                ))}
                        </div>
                    ))}

                    {/* BOTÓN NUEVA SUBCATEGORÍA */}
                    {addingSubCategoryTo === categoria.id ? (
                        renderInlineForm(
                            () => setAddingSubCategoryTo(null), 
                            (nombre) => handleCrearSubcategoria(categoria.id, nombre), 
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
                        (nombre) => handleCrearcategoria(nombre),
                        'Nombre categoría...'
                    )
                ) : (
                    <Button onClick={() => setAddingCategory(true)}>Nueva Categoría</Button>
                )}
            </div>

            {/* MODALES */}
            <NuevoProductoModal
                isOpen={showNuevoProducto}
                onClose={() => setShowNuevoProducto(false)}
                categorias={categorias}
                onGuardar={handleCrearProducto}
            />

            <EdicionProductoModal
                isOpen={showEdicionProducto}
                onClose={() => {
                    setShowEdicionProducto(false);
                    setProductoActivo(null);
                }}
                producto={productoActivo}
                subcategorias={subcategoriasDelProducto}
                onGuardar={handleEditarProducto}
                onEliminar={handleEliminarProducto}
            />

            <ConfigurarStockModal
                isOpen={showConfigStock}
                onClose={() => setShowConfigStock(false)}
                categorias={categorias}
                onEliminarCategoria={handleEliminarCategoria}
                onEliminarSubcategoria={handleEliminarSubcategoria}
            />
        </div>
    );
};

export default Stock;