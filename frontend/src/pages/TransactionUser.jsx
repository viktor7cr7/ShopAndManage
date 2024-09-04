import customFetch from "../utils/customFetch"
import { useLoaderData } from "react-router-dom"
import { useTable, useSortBy  } from 'react-table';
import { useMemo } from "react";
import StyledTable from "../assets/wrappers/TransactionUser";
import formatPrice from "../utils/formatPrice";

export const loader = async () => {
    try {
        const { data } = await customFetch('/transaction');
        return data
    } catch (error) {
        return { transactionItems: [] };
    }
}

const columns = [
    {
      Header: 'Id',
      accessor: 'transaction_balances_id',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ value }) => formatPrice(value) + ' RUB', // Форматируем при отображении
    },
    {
      Header: 'Status',
      accessor: 'status',
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
    },
  ];

  

  const TransactionTable = () => {

    const {transactionItems} = useLoaderData()
    const data = useMemo(() => 
    transactionItems.map((element) => ({
      ...element, 
      amount: element.amount,
      created_at: new Date(element.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
    })
  ), [transactionItems]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy) ;

  return (
    <StyledTable>
            <table {...getTableProps()} style={{ width: '100%' }}>
     <thead>
        {headerGroups.map(headerGroup => {
          const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...headerGroupProps}>
              {headerGroup.headers.map(column => {
                const { key: columnKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                return (
                  <th key={columnKey} {...columnProps}>
                    {column.render('Header')}
                    <span style={{marginLeft: '5px'}}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '🔽'
                          : '🔼'
                        : '⇅'}
                    </span>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          const { key, ...rowProps } = row.getRowProps();
          return (
            <tr key={row.id} {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td
                  key={cell.id}
                  {...cell.getCellProps()}
                  style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papayawhip',
                  }}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
    </StyledTable>
  );
}


export default TransactionTable

