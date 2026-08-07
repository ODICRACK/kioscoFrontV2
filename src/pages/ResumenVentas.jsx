import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Input from '../components/Input';
import EdicionVentaModal from '../components/modals/EdicionVentaModal';

const ResumenVentas = () => {
    const [, setLocation] = useLocation();


    // Estados iniciales de filtros (Mock basados en la imagen)
    const [fecha, setFecha] = useState('2026-08-26');
    const [turno, setTurno] = useState('todo');
    const [ventaAEditar, setVentaAEditar] = useState(null);

    const ventasData = [
        { id: 1, monto: 1000, fecha: '06/07/2026', hora: '8:20:30:40', metodo: 'Efectivo' },
        { id: 2, monto: 1000, fecha: '06/07/2026', hora: '8:20:30:40', metodo: 'Efectivo' },
        { id: 3, monto: 1000, fecha: '06/07/2026', hora: '8:20:30:40', metodo: 'Efectivo' },
    ];

    const totalEfectivo = 120000;
    const totalTransferencia = 300900;
    const totalGeneral = totalTransferencia; // Ajustado al mock visual

    const handleOpenEditModal = (ventaId) => {
        // TODO: Implementar apertura del modal de edición de venta en Etapa 10
        setVentaAEditar(ventaId);
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
                    <span>Monto</span>
                    <span>Fecha</span>
                    <span>Metodo</span>
                    <span>Info</span>
                </div>

                {ventasData.map((item) => (
                    <div className="resumen__row" key={item.id}>
                        <span className="resumen__row-monto">${item.monto}</span>
                        <span className="resumen__row-fecha">
                            {item.fecha}<br />{item.hora}
                        </span>
                        <span>{item.metodo}</span>
                        {/* Reemplazamos <td> por un <div> para evitar el error de DOM */}
                        <div>
                            <button
                                className="btn-info"
                                onClick={() => handleOpenEditModal(item.id)}
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
                venta={ventaAEditar} // Pasas la info de la venta para que el modal la consuma
            />
        </div>
    );
};

export default ResumenVentas;