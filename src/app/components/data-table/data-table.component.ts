import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MOCK_DATA } from '../../shared/mock-data';

export interface UserData {
  _id: string,
  isActive: boolean,
  balance: string,
  picture: string,
  age: number,
  name: {
    first: string,
    last: string,
  },
  company: string,
  email: string,
  address: string,
  tags: string[],
  favoriteFruit: string,
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<UserData>;
  filterValue: string = '';
  displayedColumns = ['isActive', 'balance', 'picture', 'age', 'name', 'company', 'email', 'address', 'tags', 'favoriteFruit'];
  selectedColumns: string[] = this.displayedColumns.slice();
  translatedColumns: { [key: string]: string } = {
    'isActive': 'Активен',
    'balance': 'Баланс',
    'picture': 'Фотография',
    'age': 'Возраст',
    'name': 'Имя',
    'company': 'Компания',
    'email': 'Эл. почта',
    'address': 'Адрес',
    'tags': 'Теги',
    'favoriteFruit': 'Любимый фрукт'
  };

  constructor() {
    const users: any[] = MOCK_DATA;
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  search(event: any): void {
    let filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getColumnOptions(column: string): string[] {
    return Array.from(new Set(this.dataSource.data.map((item: any) => item[column])));
  }

  applyFilter(column: string, filterValue: any): void {
    this.dataSource.filterPredicate = (data: any) => data[column] === filterValue;
    this.dataSource.filter = filterValue;
  }

  isActive(columnName: string): boolean {
    return columnName === 'isActive';
  }

  isPicture(columnName: string): boolean {
    return columnName === 'picture';
  }

  isColumn(columnName: string): boolean {
    return !(columnName === 'picture' || columnName === 'isActive');
  }

  toggleColumn(column: string): void {
    const index = this.selectedColumns.indexOf(column);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(column);
    }
  }

  resetTable(): void {
    this.dataSource.filter = '';
    this.sort.active = '';
    this.sort.direction = '';
    this.selectedColumns = [];
    this.dataSource._updateChangeSubscription();
  }

  renderCell(cellData: any): string {
    if (Array.isArray(cellData)) {
      return cellData.join(', ');
    } else if (cellData && typeof cellData === 'object') {
      return cellData.first + ' ' + cellData.last;
    } else if (typeof cellData === 'string' || typeof cellData === 'number' || typeof cellData === 'boolean') {
      return cellData.toString();
    } else {
      return '';
    }
  }
}
