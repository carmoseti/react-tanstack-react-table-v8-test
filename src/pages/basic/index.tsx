import {
    ColumnOrderState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {useReducer, useState} from "react";

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
    columnHelper.group({
        header: 'Full Names',
        columns: [
            columnHelper.accessor('firstName', {
                id: 'firstName',
                cell: info => info.getValue(),
                header: () => <span>First Name</span>,
                footer: info => info.column.id,
            }),
            columnHelper.accessor(row => row.lastName, {
                id: 'lastName',
                cell: info => <i>{info.getValue()}</i>,
                header: () => <span>Last Name</span>,
                footer: info => info.column.id
            }),
            columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
                id: 'combinedNames',
                header: () => <i>(Combined Names)</i>
            })
        ]
    }),
    columnHelper.group({
        header: 'Info',
        columns: [
            columnHelper.accessor('age', {
                header: () => 'Age',
                cell: info => info.renderValue(),
                footer: info => info.column.id,
            }),
            columnHelper.accessor('visits', {
                header: () => <span>Visits</span>,
                footer: info => info.column.id,
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                footer: info => info.column.id,
            }),
            columnHelper.accessor('progress', {
                header: 'Profile Progress',
                footer: info => info.column.id,
            })
        ]
    })
]

/*console.log(columns)*/

export default function () {
    const [data, setData] = useState(
        () => [...defaultData]
    )

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

    /*const rerender = useReducer(
        () => ({}), {}
    )[1]*/

    const table = useReactTable({
        data, columns, getCoreRowModel: getCoreRowModel(),
        debugAll: true, debugColumns: true, debugTable: true, debugRows: true, debugHeaders: true,
        state: {
            columnVisibility,
            columnOrder
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder
    })

    const shuffleColumnOrder = () => {
        const fnSortStringAscendingOrder = (a: string, b: string) => a > b ? 1 : a < b ? -1 : 0
        const fnSortStringDescendingOrder = (a: string, b: string) => a < b ? 1 : a > b ? -1 : 0

        table.setColumnOrder((old) => {
            return table.getAllLeafColumns().map(a => a.id)
                .sort(Math.random() > 0.5 ? fnSortStringAscendingOrder : fnSortStringDescendingOrder)
        })
    }

    return (
        <div>
            <div className={'column-visibility-bar'}>
                <label htmlFor={'all-columns-visibility-toggler'}>
                    <input
                        type={"checkbox"}
                        checked={table.getIsAllColumnsVisible()}
                        onChange={table.getToggleAllColumnsVisibilityHandler()}
                        id={'all-columns-visibility-toggler'}
                        name={'all-columns-visibility-toggler'}
                    />{' '}
                    Toggle All
                </label>
                {table.getAllLeafColumns().map((column) => (
                    <label htmlFor={`column-${column.id}-visibility-toggler`} key={column.id}>
                        <input
                            type={"checkbox"}
                            checked={column.getIsVisible()}
                            onChange={column.getToggleVisibilityHandler()}
                            id={`column-${column.id}-visibility-toggler`}
                            name={`column-${column.id}-visibility-toggler`}
                        />{' '}
                        {column.id}
                    </label>
                ))}
                <button onClick={shuffleColumnOrder}>Shuffle Column Order</button>
                <button onClick={() => table.resetColumnOrder()}>Reset Column Order</button>
            </div>
            <table className={'table'}>
                <thead>
                {table.getHeaderGroups().map((headerGroup) => {
                    return (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className={'table__header-cell'} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    )
                })}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className={'table__body-row'}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className={'table__body-cell'}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id} className={'table__footer-cell'}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </tfoot>
            </table>
        </div>
    )
}