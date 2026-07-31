import "./Panel.css";

function Panel({ children, className = "" }) {

    return (

        <section className={`panel ${className}`}>

            {children}

        </section>

    );

}

export default Panel;