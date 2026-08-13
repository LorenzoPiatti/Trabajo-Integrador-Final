import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    BadgeCheck,
    Bell,
    CalendarDays,
    ClipboardList,
    Mail,
    PawPrint,
    RefreshCw,
    Search,
    ShieldCheck,
    Syringe,
    UserCheck,
    Users,
    UserX
} from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import {
    getUsers,
    updateUserRole,
    updateUserStatus
} from "../../../services/userService";
import { getUserId, isAdmin } from "../../../utils/authUtils";
import "../styles/Users.css";

const roleOptions = [
    "Admin",
    "Veterinarian",
    "Owner",
    "Reception"
];

const roleLabels = {
    Admin: "Administrador",
    Veterinarian: "Veterinario",
    Owner: "Propietario",
    Reception: "Recepción"
};

const getRoleLabel = (role) => {
    return roleLabels[role] ?? role;
};

const getInitials = (name) => {
    const parts = (name ?? "")
        .trim()
        .split(" ")
        .filter(Boolean);

    if (parts.length === 0) {
        return "VC";
    }

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
};

const getActivityTotal = (user) => {
    return (
        (user.petsCount ?? 0) +
        (user.appointmentsCount ?? 0) +
        (user.medicalRecordsCount ?? 0) +
        (user.administeredVaccinesCount ?? 0) +
        (user.remindersCount ?? 0)
    );
};

function UsersPage() {
    const token = localStorage.getItem("token");
    const admin = isAdmin();
    const currentUserId = getUserId();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [initialLoading, setInitialLoading] =
        useState(Boolean(token && admin));
    const [savingUserId, setSavingUserId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadUsers = useCallback(async () => {
        setInitialLoading(true);
        setError("");

        try {
            const data = await getUsers();
            setUsers(data ?? []);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token || !admin) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            loadUsers();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [token, admin, loadUsers]);

    const stats = useMemo(() => {
        const activeUsers =
            users.filter((user) => user.active).length;
        const inactiveUsers = users.length - activeUsers;
        const activeAdmins =
            users.filter(
                (user) => user.active && user.role === "Admin"
            ).length;

        return {
            total: users.length,
            active: activeUsers,
            inactive: inactiveUsers,
            veterinarians: users.filter(
                (user) => user.role === "Veterinarian"
            ).length,
            admins: users.filter(
                (user) => user.role === "Admin"
            ).length,
            activeAdmins
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                !searchValue ||
                (user.name ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                (user.email ?? "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && user.active) ||
                (statusFilter === "inactive" && !user.active);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const updateUserInList = (updatedUser) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user.userId === updatedUser.userId
                    ? updatedUser
                    : user
            )
        );
    };

    const handleRoleChange = async (user, role) => {
        if (user.role === role) {
            return;
        }

        const confirmed = window.confirm(
            `Cambiar el rol de ${user.name} a ${getRoleLabel(role)}?`
        );

        if (!confirmed) {
            return;
        }

        setSavingUserId(user.userId);
        setError("");
        setSuccess("");

        try {
            const updatedUser =
                await updateUserRole(user.userId, role);

            updateUserInList(updatedUser);
            setSuccess("Rol actualizado correctamente.");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSavingUserId(null);
        }
    };

    const handleStatusChange = async (user) => {
        const nextStatus = !user.active;
        const action = nextStatus ? "activar" : "desactivar";

        const confirmed = window.confirm(
            `Querés ${action} la cuenta de ${user.name}?`
        );

        if (!confirmed) {
            return;
        }

        setSavingUserId(user.userId);
        setError("");
        setSuccess("");

        try {
            const updatedUser =
                await updateUserStatus(user.userId, nextStatus);

            updateUserInList(updatedUser);
            setSuccess(
                nextStatus
                    ? "Usuario activado correctamente."
                    : "Usuario desactivado correctamente."
            );
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSavingUserId(null);
        }
    };

    if (!token) {
        return (
            <main className="users-auth-page">
                <section className="users-auth-card">
                    <div className="users-auth-icon">
                        <Users size={30} />
                    </div>

                    <h1>Usuarios y roles</h1>

                    <p>
                        Iniciá sesión para administrar usuarios.
                    </p>

                    <Link className="users-primary-button" to="/">
                        Ir al inicio
                    </Link>
                </section>
            </main>
        );
    }

    if (!admin) {
        return (
            <Layout>
                <div className="users-dashboard">
                    <section className="users-denied">
                        <ShieldCheck size={38} />
                        <h2>Acceso restringido</h2>
                        <p>
                            Esta sección está disponible solo para
                            administradores.
                        </p>
                    </section>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Usuarios y roles"
            subtitle="Administrá cuentas y permisos"
        >
            <div className="users-dashboard">
                <section className="users-summary-grid">
                    <StatCard
                        title="Usuarios"
                        value={stats.total}
                        color="#A3C1AD"
                        icon={<Users />}
                    />

                    <StatCard
                        title="Activos"
                        value={stats.active}
                        color="#7FB3D5"
                        icon={<UserCheck />}
                    />

                    <StatCard
                        title="Inactivos"
                        value={stats.inactive}
                        color="#E57373"
                        icon={<UserX />}
                    />

                    <StatCard
                        title="Veterinarios"
                        value={stats.veterinarians}
                        color="#E8B86D"
                        icon={<ClipboardList />}
                    />

                    <StatCard
                        title="Admins"
                        value={stats.admins}
                        color="#8E7CC3"
                        icon={<ShieldCheck />}
                    />
                </section>

                {(error || success) && (
                    <section
                        className={
                            error
                                ? "users-status users-status--error"
                                : "users-status users-status--success"
                        }
                    >
                        {error || success}
                    </section>
                )}

                <Panel className="users-list-panel">
                    <div className="users-panel-header">
                        <div>
                            <h2>Usuarios y roles</h2>

                            <p>
                                {filteredUsers.length} de {users.length}
                                {" "}usuario(s)
                            </p>
                        </div>

                        <button
                            type="button"
                            className="users-ghost-button"
                            onClick={loadUsers}
                            disabled={initialLoading}
                        >
                            <RefreshCw size={18} />
                            <span>Actualizar</span>
                        </button>
                    </div>

                    <div className="users-toolbar">
                        <label className="users-search">
                            <Search size={18} />
                            <input
                                type="search"
                                placeholder="Buscar usuario"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </label>

                        <select
                            className="users-filter"
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value)
                            }
                        >
                            <option value="all">Todos los roles</option>
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {getRoleLabel(role)}
                                </option>
                            ))}
                        </select>

                        <select
                            className="users-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>

                    {initialLoading ? (
                        <p className="users-empty-state">
                            Cargando usuarios...
                        </p>
                    ) : filteredUsers.length === 0 ? (
                        <div className="users-empty-state users-empty-state--center">
                            <Users size={42} />
                            <p>No hay usuarios para mostrar.</p>
                        </div>
                    ) : (
                        <div className="users-list-shell">
                            <div className="users-table">
                                <div className="users-table-header">
                                    <span>Usuario</span>
                                    <span>Rol actual</span>
                                    <span>Actividad</span>
                                    <span>Estado</span>
                                    <span>Acciones</span>
                                </div>

                                <div className="users-record-list">
                                    {filteredUsers.map((user) => {
                                        const isSelf =
                                            user.userId === currentUserId;
                                        const roleLocked =
                                            isSelf ||
                                            user.hasAssociatedData ||
                                            (
                                                user.role === "Admin" &&
                                                user.active &&
                                                stats.activeAdmins <= 1
                                            );
                                        const statusLocked =
                                            isSelf ||
                                            (
                                                user.role === "Admin" &&
                                                user.active &&
                                                stats.activeAdmins <= 1
                                            );

                                        return (
                                            <article
                                                className="users-row"
                                                key={user.userId}
                                            >
                                                <div className="users-person">
                                                    <div className="users-avatar">
                                                        {getInitials(user.name)}
                                                    </div>

                                                    <div className="users-person-info">
                                                        <strong>
                                                            {user.name}
                                                        </strong>

                                                        <span>
                                                            <Mail size={14} />
                                                            {user.email}
                                                        </span>

                                                        {user.emailVerified && (
                                                            <small>
                                                                <BadgeCheck size={13} />
                                                                Email verificado
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                <span
                                                    className={`users-role-badge users-role-badge--${user.role.toLowerCase()}`}
                                                >
                                                    {getRoleLabel(user.role)}
                                                </span>

                                                <div className="users-activity">
                                                    <span>
                                                        <PawPrint size={14} />
                                                        {user.petsCount ?? 0}
                                                    </span>

                                                    <span>
                                                        <CalendarDays size={14} />
                                                        {user.appointmentsCount ?? 0}
                                                    </span>

                                                    <span>
                                                        <ClipboardList size={14} />
                                                        {user.medicalRecordsCount ?? 0}
                                                    </span>

                                                    <span>
                                                        <Syringe size={14} />
                                                        {user.administeredVaccinesCount ?? 0}
                                                    </span>

                                                    <span>
                                                        <Bell size={14} />
                                                        {user.remindersCount ?? 0}
                                                    </span>
                                                </div>

                                                <span
                                                    className={
                                                        user.active
                                                            ? "users-status-badge users-status-badge--active"
                                                            : "users-status-badge users-status-badge--inactive"
                                                    }
                                                >
                                                    {user.active
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </span>

                                                <div className="users-actions">
                                                    <label className="users-action-field">
                                                        <span>Rol</span>

                                                        <select
                                                            value={user.role}
                                                            disabled={
                                                                savingUserId === user.userId ||
                                                                roleLocked
                                                            }
                                                            onChange={(event) =>
                                                                handleRoleChange(
                                                                    user,
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            {roleOptions.map((role) => (
                                                                <option
                                                                    key={role}
                                                                    value={role}
                                                                >
                                                                    {getRoleLabel(role)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>

                                                    <button
                                                        type="button"
                                                        className={
                                                            user.active
                                                                ? "users-status-button users-status-button--danger"
                                                                : "users-status-button"
                                                        }
                                                        disabled={
                                                            savingUserId === user.userId ||
                                                            statusLocked
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(user)
                                                        }
                                                    >
                                                        {user.active
                                                            ? "Desactivar"
                                                            : "Activar"}
                                                    </button>

                                                    {user.hasAssociatedData && (
                                                        <small className="users-lock-hint">
                                                            {getActivityTotal(user)} dato(s) asociados
                                                        </small>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </Panel>
            </div>
        </Layout>
    );
}

export default UsersPage;
