import React from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';

const statusConfig = {
  Pending: {
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    Icon: Clock,
  },
  Confirmed: {
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
    Icon: CheckCircle2,
  },
  Shipped: {
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-500',
    Icon: Truck,
  },
  Delivered: {
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
    Icon: PackageCheck,
  },
  Cancelled: {
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500',
    Icon: XCircle,
  },
};

const StatusBadge = ({ status = 'Pending', showIcon = true, size = 'default' }) => {
  const normalizedStatus = statusConfig[status] ? status : 'Pending';
  const { badgeClass, Icon } = statusConfig[normalizedStatus];

  const sizeClasses =
    size === 'small'
      ? 'px-2 py-0.5 text-xs'
      : size === 'large'
      ? 'px-3.5 py-1.5 text-sm'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${badgeClass} ${sizeClasses}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{normalizedStatus}</span>
    </span>
  );
};

export default StatusBadge;
