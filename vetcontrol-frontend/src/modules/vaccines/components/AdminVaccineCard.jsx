import { CalendarDays, Edit3, Package, Syringe, Trash2 } from "lucide-react";

const getStockState = (stock) => {
    if (stock === 0) {
        return {
            label: "Sin stock",
            className: "vaccine-status vaccine-status--overdue"
        };
    }

    if (stock <= 5) {
        return {
            label: "Stock bajo",
            className: "vaccine-status vaccine-status--warning"
        };
    }

    return {
        label: "Disponible",
        className: "vaccine-status"
    };
};

function AdminVaccineCard({
    vaccine,
    onEdit,
    onDelete
}) {

    const stockState = getStockState(vaccine.stock);

    return (

        <article className="vaccine-row">

            <div className="vaccine-row-main">

                <div className="vaccine-avatar">
                    <Syringe size={24} />
                </div>

                <div className="vaccine-info">

                    <div className="vaccine-heading">

                        <h3>
                            {vaccine.name}
                        </h3>

                        <span className={stockState.className}>
                            {stockState.label}
                        </span>

                    </div>

                    <div className="vaccine-details">

                        <span>
                            <Package size={15} />
                            Stock: {vaccine.stock}
                        </span>

                        <span>
                            <CalendarDays size={15} />
                            Frecuencia: {vaccine.frequencyMonths} meses
                        </span>

                    </div>

                    {vaccine.description && (

                        <p className="vaccine-observation">
                            {vaccine.description}
                        </p>

                    )}

                </div>

                <div className="vaccine-actions">

                    <button
                        className="vaccine-icon-button"
                        type="button"
                        onClick={() => onEdit(vaccine)}
                        title="Editar vacuna"
                    >
                        <Edit3 size={18} />
                    </button>

                    <button
                        className="vaccine-icon-button vaccine-icon-button--danger"
                        type="button"
                        onClick={() => onDelete(vaccine.vaccineId)}
                        title="Eliminar vacuna"
                    >
                        <Trash2 size={18} />
                    </button>

                </div>

            </div>

        </article>
    );
}

export default AdminVaccineCard;
