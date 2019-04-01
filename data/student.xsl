<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method='html' version='1.0' encoding='UTF-8' indent='yes'/>
    <xsl:template match="/">
        <html>
            <body>
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="restaurant">
        <h3>Kiku Sushi</h3>
    </xsl:template>

    <xsl:template match="author">
        <h3>Jakob Garricks</h3>
    </xsl:template>

    <xsl:template match="nigiri">
        <h3>Nigiri</h3>
        <ul>
            <xsl:for-each select="item">
            <xsl:sort select="@name"/>
                <li>
                    <xsl:apply-templates select="@name"/>
                    
                    <ul>
                        <li>Discription: <u><xsl:apply-templates select="description"/></u></li>
                        <li style="text-align: right">Price: <xsl:apply-templates select="price"/></li>
                        <xsl:if test="vegetarian">
                        <li><img src="https://cdn1.iconfinder.com/data/icons/alternate-foods/512/alternate_foods-33-512.png" height="30" width="30"/></li>
                        </xsl:if>
                    </ul>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>

    <xsl:template match="maki">
        <h3>Maki</h3>
        <ul>
            <xsl:for-each select="item">
            <xsl:sort select="@name"/>
                <li>
                    <xsl:apply-templates select="@name"/>
                    <ul>
                        <li>Discription: <u><xsl:apply-templates select="description"/></u></li>
                        <li style="text-align: right">Price: <xsl:apply-templates select="price"/></li>
                        <xsl:if test="vegetarian">
                        <li><img src="https://cdn1.iconfinder.com/data/icons/alternate-foods/512/alternate_foods-33-512.png" height="30" width="30"/></li>
                        </xsl:if>
                    </ul>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>

    <xsl:template match="kids">
        <h3>Kids</h3>
        <ul>
            <xsl:for-each select="item">
            <xsl:sort select="@name"/>
                <li>
                    <xsl:apply-templates select="@name"/>
                    <ul>
                        <li>Discription: <u><xsl:apply-templates select="description"/></u></li>
                        <li style="text-align: right">Price: <xsl:apply-templates select="price"/></li>
                        <xsl:if test="vegetarian">
                        <li><img src="https://cdn1.iconfinder.com/data/icons/alternate-foods/512/alternate_foods-33-512.png" height="30" width="30"/></li>
                        </xsl:if>
                    </ul>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>

</xsl:stylesheet>