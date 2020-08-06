import fs = require('fs');

//
//  Interfaces to import vulnerabilities.json into
//
interface AnchoreVulnResults {
    imageDigest: string;
    vulnerabilities: AnchoreCVE[];
    vulnerability_type: string;
}

interface AnchoreCVE {
    feed: string;
    feed_group: string;
    fix: string;
    nvd_data: NvdData[];
    package: string;
    package_cpe: string;
    package_cpe23: string;
    package_name: string;
    package_path: string;
    package_type: string;
    package_version: string;
    severity: string;
    url: string;
    vendor_data: string[];
    vuln: string;
}

interface NvdData {
    id: string;
}


//
//  Prints out an artifact for a column. Also prints the extra spacing required
//  between columns.
//
function printColumn(artifact: string, space: number) {
    process.stdout.write(artifact);
    process.stdout.write(Array(space + 4 - artifact.length).join(' '));
}


//
//  Updates the max length of the column if the  current artifact is longer
//  than the previously tracked max length current column.
//
function updateLen(max: number, current: string): number {
    if (max < current.length) {
        return current.length;
    }
    return max;
}


//
//  Print the vulnerability report to the terminal with the following columns.
//   * Vulnerability ID
//   * Package
//   * Severity
//   * Fix
//   * Vulnerability URL
//   * Type
//   * Feed Group
//   * Package Path
//
export function printVulnerabilityReport(path: string) {

    // Read in the vulnerability results
    let vulns = <AnchoreVulnResults>JSON.parse(fs.readFileSync(path).toString());
    let cve: AnchoreCVE[] = vulns.vulnerabilities;

    // Set up the table headers
    let header = {
        VulnID:      'Vulnerability ID',
        Package:     'Package',
        Severity:    'Severity',
        Fix:         'Fix',
        Url:         'Vulnerability URL',
        Type:        'Type',
        FeedGroup:   'Feed Group',
        PackagePath: 'Package Path',
    };

    // Initialize the spacing for the columns
    let len = {
        VulnID:      header.VulnID.length,
        Package:     header.Package.length,
        Severity:    header.Severity.length,
        Fix:         header.Fix.length,
        Url:         header.Url.length,
        Type:        header.Type.length,
        FeedGroup:   header.FeedGroup.length,
        PackagePath: header.PackagePath.length,
    };

    // Calculate the max space required for each column
    for (let i = 0; i < cve.length; i++) {
        len.VulnID      = updateLen(len.VulnID,      cve[i].vuln);
        len.Package     = updateLen(len.Package,     cve[i].package);
        len.Severity    = updateLen(len.Severity,    cve[i].severity);
        len.Fix         = updateLen(len.Fix,         cve[i].fix);
        len.Url         = updateLen(len.Url,         cve[i].url);
        len.Type        = updateLen(len.Type,        cve[i].package_type);
        len.FeedGroup   = updateLen(len.FeedGroup,   cve[i].feed_group);
        len.PackagePath = updateLen(len.PackagePath, cve[i].package_path);
    }

    // Print out the table header
    printColumn(header.VulnID,      len.VulnID);
    printColumn(header.Package,     len.Package);
    printColumn(header.Severity,    len.Severity);
    printColumn(header.Fix,         len.Fix);
    printColumn(header.Url,         len.Url);
    printColumn(header.Type,        len.Type);
    printColumn(header.FeedGroup,   len.FeedGroup);
    process.stdout.write(header.PackagePath);
    process.stdout.write('\n');

    // Print out table row-by-row
    for (let i = 0; i < cve.length; i++) {
        printColumn(cve[i].vuln,         len.VulnID);
        printColumn(cve[i].package,      len.Package);
        printColumn(cve[i].severity,     len.Severity);
        printColumn(cve[i].fix,          len.Fix);
        printColumn(cve[i].url,          len.Url);
        printColumn(cve[i].package_type, len.Type);
        printColumn(cve[i].feed_group,   len.FeedGroup);
        process.stdout.write(cve[i].package_path);
        process.stdout.write('\n');
    }
}
