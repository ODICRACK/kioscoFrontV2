import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Input from '../components/Input';
import { ventasService } from '../services/ventasService';
import EdicionVentaModal from '../components/modals/EdicionVentaModal';

const ResumenVentas = () => {
    const [, setLocation] = useLocation();

    const hoy = new Date().toISOString().split('T')[0];
    const [fecha, setFecha] = useState(hoy);
    const [turno, setTurno] = useState('todo');
    const [ventas, setVentas] = useState([]);
    const [ventaAEditar, setVentaAEditar] = useState(null);

    useEffect(() => {
        cargarVentas();
    }, [fecha, turno]);

    const cargarVentas = async () => {
        try {
            const turnoFiltro = turno === 'todo' ? undefined : turno;
            const res = await ventasService.obtenerResumen(fecha, turnoFiltro);
            setVentas(res || []);
        } catch (error) {
            console.error('Error al cargar ventas:', error);
        }
    };

    let totalEfectivo = 0;
    let totalTransferencia = 0;

    const ventasFormateadas = (ventas || []).map(v => {
        let montoVenta = 0;
        const metodosArr = [];

        (v.pagos || []).forEach(p => {
            const m = Number(p.monto) || 0;
            montoVenta += m;
            if (p.metodo === 'efectivo') totalEfectivo += m;
            if (p.metodo === 'transferencia') totalTransferencia += m;
            if (p.metodo && !metodosArr.includes(p.metodo)) {
                metodosArr.push(p.metodo.charAt(0).toUpperCase() + p.metodo.slice(1));
            }
        });

        const f = new Date(v.fecha_hora);
        const fechaStr = isNaN(f.getTime()) ? '' : f.toLocaleDateString('es-AR');
        const horaStr = isNaN(f.getTime()) ? '' : f.toLocaleTimeString('es-AR');

        let iconoTurno = 'sunny';
        if (v.turno === 'tarde') iconoTurno = 'wb_twilight';
        if (v.turno === 'noche') iconoTurno = 'bedtime';

        return {
            id: v.id,
            monto: montoVenta,
            fecha: fechaStr,
            hora: horaStr,
            turno: v.turno || 'mañana',
            iconoTurno,
            metodo: metodosArr.join(' / ') || 'Efectivo',
            rawVenta: v
        };
    });

    const totalGeneral = totalEfectivo + totalTransferencia;

    const handleOpenEditModal = (venta) => {
        setVentaAEditar(venta);
    };

    const handleEditarVenta = async (idVenta, productosModificados) => {
        try {
            await ventasService.editarVenta(idVenta, productosModificados);
            cargarVentas();
        } catch (error) {
            console.error('Error al editar venta:', error);
        }
    };

    return (
        <div className="resumen">
            <Header title="Resumen de ventas" onBackClick={() => setLocation('/')} />

            <div className="resumen__card">
                <div className="resumen__filters">
                    <div className="resumen__filter-group">
                        <label className="resumen__filter-label">Dia:</label>
                        <Input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>

                    <div className="resumen__filter-group">
                        <label className="resumen__filter-label">Turno:</label>
                        <select
                            className="input"
                            value={turno}
                            onChange={(e) => setTurno(e.target.value)}
                        >
                            <option value="todo">Todo el dia</option>
                            <option value="mañana">Mañana</option>
                            <option value="tarde">Tarde</option>
                            <option value="noche">Noche</option>
                        </select>
                    </div>
                </div>

                <div className="resumen__totals-row">
                    <div className="resumen__total-box resumen__total-box--efectivo">
                        $ {totalEfectivo.toLocaleString('es-AR')}
                    </div>
                    <div className="resumen__total-box resumen__total-box--transferencia">
                        $ {totalTransferencia.toLocaleString('es-AR')}
                    </div>
                </div>

                <div className="resumen__grand-total">
                    Total: $ {totalGeneral.toLocaleString('es-AR')}
                </div>
            </div>

            {/* Tabla de detalle */}
            <div className="resumen__table">
                <div className="resumen__table-header">
                    <span>Turno</span>
                    <span>Monto</span>
                    <span>Fecha</span>
                    <span>Metodo</span>
                    <span>Info</span>
                </div>

                {ventasFormateadas.map((item) => (
                    <div className="resumen__row" key={item.id}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <span className="material-symbols-outlined">{item.iconoTurno}</span>
                        </span>
                        <span className="resumen__row-monto">${item.monto}</span>
                        <span className="resumen__row-fecha">
                            {item.fecha}<br />{item.hora}
                        </span>
                        <span>{item.metodo}</span>
                        <div>
                            <button
                                className="btn-info"
                                onClick={() => handleOpenEditModal(item.rawVenta)}
                                type="button"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                                    info
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <EdicionVentaModal
                isOpen={ventaAEditar !== null}
                onClose={() => setVentaAEditar(null)}
                venta={ventaAEditar}
                onConfirmar={handleEditarVenta}
            />
        </div>
    );
};

export default ResumenVentas;