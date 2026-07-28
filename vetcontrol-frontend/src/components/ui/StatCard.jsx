import "./StatCard.css";

function StatCard({

    title,
    value,
    icon,
    color

}) {

    return (

        <div className="stat-card">

            <div
                className="stat-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div>

                <p className="stat-title">
                    {title}
                </p>

                <h2 className="stat-value">
                    {value}
                </h2>

            </div>

        </div>

    );

}

export default StatCard;