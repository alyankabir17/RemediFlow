'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, TrendingUp, TrendingDown, Package, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: any[];
}

interface StockInfo {
  productId: string;
  productName: string;
  totalPurchases: number;
  totalSales: number;
  currentStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

interface OrderStats {
  status: string;
  count: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stockData, setStockData] = useState<StockInfo[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrderStats[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadReportsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsRes, stockRes, ordersRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/reports/stock'),
        fetch('/api/admin/orders?limit=1000'),
      ]);

      // Check response status before parsing JSON
      const statsData = statsRes.ok ? await statsRes.json() : { success: false };
      const stockDataRes = stockRes.ok ? await stockRes.json() : { success: false };
      const ordersData = ordersRes.ok ? await ordersRes.json() : { data: [] };

      if (statsData.success) {
        setStats(statsData.data);
      }

      if (stockDataRes.success) {
        setStockData(stockDataRes.data || []);
        // Get top products by sales
        const sorted = [...(stockDataRes.data || [])].sort((a: StockInfo, b: StockInfo) => b.totalSales - a.totalSales);
        setTopProducts(sorted.slice(0, 5));
      }

      // Calculate orders by status
      if (ordersData.data) {
        const statusCounts: Record<string, number> = {};
        ordersData.data.forEach((order: any) => {
          statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });
        setOrdersByStatus(
          Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
        );
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReportsData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadReportsData, 30000);
    return () => clearInterval(interval);
  }, [loadReportsData]);

  const exportToCSV = () => {
    if (!stockData.length && !stats) {
      alert('No data to export');
      return;
    }

    // Build CSV content
    let csvContent = '';
    
    // Summary section
    csvContent += 'REMEDYFLOW REPORTS\n';
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;
    csvContent += `Period: Last ${period} days\n\n`;

    // Stats summary
    if (stats) {
      csvContent += 'SUMMARY\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Revenue,Rs ${stats.totalRevenue.toFixed(2)}\n`;
      csvContent += `Total Orders,${stats.totalOrders}\n`;
      csvContent += `Total Products,${stats.totalProducts}\n`;
      csvContent += `Pending Orders,${stats.pendingOrders}\n\n`;
    }

    // Orders by status
    if (ordersByStatus.length) {
      csvContent += 'ORDERS BY STATUS\n';
      csvContent += 'Status,Count\n';
      ordersByStatus.forEach(({ status, count }) => {
        csvContent += `${status},${count}\n`;
      });
      csvContent += '\n';
    }

    // Stock report
    if (stockData.length) {
      csvContent += 'STOCK REPORT\n';
      csvContent += 'Product Name,Total Purchases,Total Sales,Current Stock,Status\n';
      stockData.forEach((item) => {
        const status = item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'In Stock';
        csvContent += `"${item.productName}",${item.totalPurchases},${item.totalSales},${item.currentStock},${status}\n`;
      });
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `remedyflow-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const lowStockCount = stockData.filter(s => s.isLowStock).length;
  const outOfStockCount = stockData.filter(s => s.isOutOfStock).length;
  const avgOrderValue = stats && stats.totalOrders > 0 
    ? stats.totalRevenue / stats.totalOrders 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">
            View analytics and insights
            {lastUpdated && (
              <span className="text-xs text-gray-400 ml-2">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadReportsData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={exportToCSV} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
                <p className="text-xs text-gray-500 mt-1">From confirmed orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Orders
                </CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                <p className="text-xs text-gray-500 mt-1">{stats?.pendingOrders || 0} pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Order Value
                </CardTitle>
                {avgOrderValue > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-gray-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</div>
                <p className="text-xs text-gray-500 mt-1">Per order average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Stock Alerts
                </CardTitle>
                <AlertTriangle className={`h-4 w-4 ${outOfStockCount > 0 ? 'text-red-600' : lowStockCount > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockCount + outOfStockCount}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {outOfStockCount} out of stock, {lowStockCount} low
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Orders by Status */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersByStatus.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {ordersByStatus.map(({ status, count }) => {
                      const total = ordersByStatus.reduce((sum, o) => sum + o.count, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-16 text-right">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">In Stock</span>
                    <span className="text-lg font-bold text-green-800">
                      {stockData.filter(s => !s.isOutOfStock && !s.isLowStock).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-yellow-800">Low Stock</span>
                    <span className="text-lg font-bold text-yellow-800">{lowStockCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">Out of Stock</span>
                    <span className="text-lg font-bold text-red-800">{outOfStockCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sales data yet</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-gray-500">
                            Stock: {product.currentStock} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{product.totalSales} sold</p>
                        <Badge variant={product.isOutOfStock ? 'destructive' : product.isLowStock ? 'secondary' : 'default'}>
                          {product.isOutOfStock ? 'Out of Stock' : product.isLowStock ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Full Stock Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Stock Report</CardTitle>
            </CardHeader>
            <CardContent>
              {stockData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">Product</th>
                        <th className="text-right py-3 px-2 font-medium">Purchased</th>
                        <th className="text-right py-3 px-2 font-medium">Sold</th>
                        <th className="text-right py-3 px-2 font-medium">Stock</th>
                        <th className="text-center py-3 px-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((item) => (
                        <tr key={item.productId} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium">{item.productName}</td>
                          <td className="py-3 px-2 text-right">{item.totalPurchases}</td>
                          <td className="py-3 px-2 text-right">{item.totalSales}</td>
                          <td className="py-3 px-2 text-right font-bold">{item.currentStock}</td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant={item.isOutOfStock ? 'destructive' : item.isLowStock ? 'secondary' : 'default'}>
                              {item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'In Stock'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
